from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import analyze_resume_with_ai

router = APIRouter(prefix="/ats", tags=["ats"])

class ATSRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/analyze")
async def analyze_resume(request: ATSRequest):
    try:
        analysis = analyze_resume_with_ai(request.resume_text, request.job_description)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
