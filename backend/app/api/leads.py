# backend/app/api/leads.py
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.lead import Lead, LeadStatus
from app.services.storage_service import upload_resume_to_s3
from app.services.email_service import send_lead_notifications
from app.core.security import get_current_user # Dependency for Auth Guard

router = APIRouter()

# 1. PUBLIC: Create Lead (Multipart form-data to accept file uploads)
@router.post("/public/leads", status_code=201)
async def create_lead(
    background_tasks: BackgroundTasks,
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Upload file asynchronously or directly to bucket storage
    resume_url = await upload_resume_to_s3(resume)
    
    new_lead = Lead(
        first_name=first_name,
        last_name=last_name,
        email=email,
        resume_url=resume_url,
        status=LeadStatus.PENDING.value
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    
    # Offload email trigger to background tasks so API stays fast
    background_tasks.add_task(send_lead_notifications, new_lead.email, new_lead.first_name)
    
    return {"message": "Lead submitted successfully", "lead_id": new_lead.id}

# 2. PROTECTED: Get All Leads
@router.get("/internal/leads")
def get_leads(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(Lead).order_by(Lead.created_at.desc()).all()

# 3. PROTECTED: Update Status manually to REACHED_OUT
@router.patch("/internal/leads/{lead_id}/status")
def update_lead_status(
    lead_id: str, 
    status: LeadStatus, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    # Convert the string path parameter to a real UUID object for SQLite compatibility
    try:
        db_uuid = uuid.UUID(lead_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID string format")

    # Use the converted db_uuid object in your query filter
    lead = db.query(Lead).filter(Lead.id == db_uuid).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    lead.status = status.value
    db.commit()
    return {"message": f"Lead updated to {status.value}"}