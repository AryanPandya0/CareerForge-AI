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
        if not request.resume_text:
            raise HTTPException(status_code=400, detail="Please provide a resume (Upload or Paste).")
        if not request.job_description:
            raise HTTPException(status_code=400, detail="Please paste a Job Description first.")
        
        analysis = analyze_resume_with_ai(request.resume_text, request.job_description)
        
        # Convert Pydantic model to dict for proper JSON serialization
        try:
            return analysis.model_dump()
        except AttributeError:
            return analysis.dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
