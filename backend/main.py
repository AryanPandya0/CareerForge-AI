from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from routes import resume, ats, chat
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import os
import io

load_dotenv()

app = FastAPI(title="CareerForge AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        text = ""
        for page in reader.pages:
            text += page.extract_text()
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
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
