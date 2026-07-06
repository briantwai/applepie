# Add this import at the top of main.py
from app.api.auth import router as auth_router

from fastapi.staticfiles import StaticFiles
import os

# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.leads import router as leads_router
# Note: If you haven't created the database yet, you can comment out the next line
from app.core.database import Base, engine 

# Create the database tables on startup (simplest setup for local dev)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database connection skipped or failed: {e}")

app = FastAPI(title="Lead Management System API")

# CRITICAL: Allow your Next.js frontend (port 3000) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("./mock_storage", exist_ok=True)
app.mount("/static", StaticFiles(directory="./mock_storage"), name="static")

# Add this line right below where you included the leads router:
app.include_router(auth_router, prefix="/api", tags=["Authentication"])

# Include our leads router
app.include_router(leads_router, prefix="/api", tags=["Leads"])

@app.get("/")
def root():
    return {"message": "Welcome to the Lead Management System API"}