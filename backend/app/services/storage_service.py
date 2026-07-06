# backend/app/services/storage_service.py
import os
from fastapi import UploadFile

# Local mock storage folder
UPLOAD_DIR = "./mock_storage"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def upload_resume_to_s3(file: UploadFile) -> str:
    """Simulates uploading to an S3 bucket by saving files locally"""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Read and save the file locally
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    # Return a simulated public URL path for the dashboard to access
    return f"http://localhost:8000/static/{file.filename}"