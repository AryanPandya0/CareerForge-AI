import os
import sys
import io

# ── CRITICAL: Set the backend directory in sys.path BEFORE any local imports ──
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from routes import resume, ats, chat
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import uvicorn

# Load .env from project root (one level up from backend/)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = FastAPI(title="CareerForge AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://careerforge-kohl.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/extract-pdf")
async def extract_pdf(file: UploadFile = File(...)):
    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        reader = PdfReader(pdf_file)
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if isinstance(page_text, str):
                text_parts.append(page_text)
        text = "".join(text_parts)
        return {"text": text}
    except Exception as e:
        return {"error": str(e)}

app.include_router(resume.router)
app.include_router(ats.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"message": "Welcome to CareerForge AI API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
