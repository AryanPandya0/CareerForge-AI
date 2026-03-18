from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.ai_service import generate_resume_data
from services.pdf_service import generate_pdf_resume
import base64

router = APIRouter(prefix="/resume", tags=["resume"])

class ResumeRequest(BaseModel):
    profile_name: str
    email: str = ""
    phone: str = ""
    github: str = ""
    summary: str = ""
    skills: str = ""
    projects: str = ""
    experience: str = ""
    education: str = ""
    other_info: Optional[str] = ""
    achievements: Optional[str] = ""
    job_desc: str = ""
    template_choice: str = "Modern (Bold Header)"
    theme_color: str = "#1A237E"

@router.post("/generate")
async def generate_resume(request: ResumeRequest):
    try:
        if not request.profile_name or not request.skills:
            raise HTTPException(status_code=400, detail="Please enter at least your Name and Skills.")
        
        # Generate structured data using AI
        ai_data = generate_resume_data(
            request.profile_name, request.summary, request.skills, request.projects,
            request.experience, request.education, request.other_info, request.achievements,
            request.job_desc
        )
        
        # Convert hex color to RGB
        hex_str: str = str(request.theme_color).lstrip('#')
        if not hex_str or len(hex_str) != 6:
            hex_str = "1A237E" # Fallback if invalid
            
        r = int(hex_str[0] + hex_str[1], 16)
        g = int(hex_str[2] + hex_str[3], 16)
        b = int(hex_str[4] + hex_str[5], 16)
        rgb_color = (r, g, b)
        
        # Prepare contact info from request
        contact_info = f"{request.email}  |  {request.phone}  |  {request.github}"
        
        # Convert Pydantic model to dict
        try:
            ai_dict = ai_data.model_dump()
        except AttributeError:
            ai_dict = ai_data.dict()
        
        # Generate PDF
        pdf_bytes = generate_pdf_resume(
            ai_dict, contact_info, request.template_choice, rgb_color
        )
        
        # Build full resume text for ATS scanner
        full_resume_text = f"{ai_dict['summary']}\n\nSKILLS: {', '.join(ai_dict['skills'])}\n\nEXPERIENCE: {chr(10).join(ai_dict['experience'])}\n\nPROJECTS: {chr(10).join(ai_dict['projects'])}"
        
        # Return AI data and base64 encoded PDF
        return {
            "ai_data": ai_dict,
            "pdf_base64": base64.b64encode(pdf_bytes).decode('utf-8'),
            "full_resume_text": full_resume_text
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
