# backend/app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import create_access_token

router = APIRouter()

# Simple hardcoded check for local dev simulation. 
# In production, you would look up password hashes in your DB.
MOCK_ATTORNEY_EMAIL = "attorney@almalaw.com"
MOCK_ATTORNEY_PASSWORD = "password123"

@router.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != MOCK_ATTORNEY_EMAIL or form_data.password != MOCK_ATTORNEY_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}