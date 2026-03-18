# CareerForge AI 🚀

CareerForge AI is a modern, AI-powered career assistant designed to help candidates build professional resumes, analyze them against job descriptions, and prepare for interviews using advanced LLMs.

![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![LangChain](https://img.shields.io/badge/LangChain-Orchestration-green)
![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-orange)

---

## 📂 Project Structure

```bash
CareerForge-AI/
├── assets/             # Media assets (videos, images)
├── backend/            # FastAPI Backend
│   ├── routes/         # API endpoints (ATS, Resume, Chat)
│   ├── services/       # AI logic and utilities
│   ├── main.py         # Entry point
│   └── requirements.txt
├── frontend/           # React + Vite + Tailwind Frontend
│   ├── src/            # Components, Pages, and Styles
│   ├── public/         # Static assets
│   └── package.json
├── .env                # Environment variables (API Keys)
├── .gitignore          # Git exclusion rules
└── README.md           # Project documentation
```

---

## ✨ Features

### 1️⃣ 📝 Smart Resume Builder
Transforms raw, unstructured notes into a polished, professional PDF.
* **Tech:** Uses `FPDF` for pixel-perfect layout and AI agents to convert basic sentences into "Action-Metric-Result" bullet points.
* **Outcome:** Generates a downloadable, ATS-friendly PDF.

### 2️⃣ 📊 ATS Scanner & Salary Predictor
A strict algorithmic analysis of how well a resume matches a specific Job Description (JD).
* **Tech:** Uses **Structured Output** to force the AI to return a specific JSON schema containing a Match Score (0-100), Missing Keywords list, and Salary Prediction (in LPA).
* **Logic:** Hides the "Salary Prediction" unless the candidate crosses a "Hirable" threshold to encourage improvement.

### 3️⃣ 🤖 AI Career Coach
A context-aware chatbot that acts as a Senior Technical Recruiter.
* **Tech:** Maintains **Chat History** to remember previous context, allowing users to practice mock interviews or ask roadmap questions.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **LLM** | Google Gemini 2.5 Flash | High-speed, low-latency reasoning |
| **Orchestration** | LangChain | Managing prompts and chains |
| **Backend** | FastAPI | High-performance API framework |
| **Frontend** | React / Vite | Modern, responsive UI |
| **Validation** | Pydantic | Enforcing strict JSON output schemas |
| **PDF Engine** | PyPDF2 / FPDF | Text extraction and PDF generation |

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/devdoshi19/CareerForge-AI.git
cd CareerForge-AI
```

### 2. Set up API Keys
Create a `.env` file in the root directory:
```env
# Add one or more keys starting with GEMINI_KEY_ or just GOOGLE_API_KEY
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. Run the Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Server runs at `http://localhost:8000`*

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
*App runs at `http://localhost:5173`*

---

## 🔮 Future Improvements
* **Database Integration:** Saving user profiles using PostgreSQL/Supabase.
* **RAG Implementation:** Deeper resume analysis via document embeddings.
* **Interview Simulator:** Voice-based mock interviews.

---

<div align="center">
<small>Built with ❤️ by <b>Dev Doshi</b> | Powered by Google Gemini & LangChain</small>
</div>
