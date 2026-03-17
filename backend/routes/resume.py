from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.ai_service import generate_resume_data
from services.pdf_service import generate_pdf_resume
import base64

router = APIRouter(prefix="/resume", tags=["resume"])

class ResumeRequest(BaseModel):
    profile_name: str
    email: str
    phone: str
    github: str
    summary: str
    skills: str
    projects: str
    experience: str
    education: str
    other_info: Optional[str] = ""
    achievements: Optional[str] = ""
    job_desc: str
    template_choice: str = "Modern (Bold Header)"
    theme_color: str = "#1A237E"

@router.post("/generate")
async def generate_resume(request: ResumeRequest):
    try:
        # Generate structured data using AI
        ai_data = generate_resume_data(
            request.profile_name, request.summary, request.skills, request.projects,
            request.experience, request.education, request.other_info, request.achievements,
            request.job_desc
        )
        
        # Convert hex color to RGB
        hex_color = request.theme_color.lstrip('#')
        rgb_color = tuple(int(hex_color[i:i+2], 16) for i in range(0, 6, 2))
        
        # Prepare contact info from request
        contact_info = f"{request.email}  |  {request.phone}  |  {request.github}"
        
        # Generate PDF
        pdf_content = generate_pdf_resume(
            ai_data.dict(), contact_info, request.template_choice, rgb_color
        )
        
        # Return AI data and base64 encoded PDF
        return {
            "ai_data": ai_data,
            "pdf_base64": base64.b64encode(pdf_content).decode('utf-8')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
