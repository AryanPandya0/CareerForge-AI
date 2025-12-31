# 🚀 CareerForge AI
> **Build. Scan. Succeed.** Your All-in-One AI Career Architect.

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Streamlit](https://img.shields.io/badge/Streamlit-UI-red)
![LangChain](https://img.shields.io/badge/LangChain-Orchestration-green)
![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-orange)

## 📖 Overview
**CareerForge AI** is a full-stack AI platform designed to automate and optimize the job placement journey. Unlike simple wrapper tools, this application orchestrates multiple AI agents to handle specific career tasks: building ATS-proof resumes, analyzing job descriptions for gaps, and providing real-time interview coaching.

It leverages **Google Gemini 2.5** for intelligence and **LangChain** for robust model orchestration, wrapped in a high-performance **Streamlit** frontend.

---

## 🌟 Key Features

### 1️⃣ 📝 Smart Resume Builder
Transforms raw, unstructured user notes into a polished, professional PDF.
* **Tech:** Uses `FPDF` for pixel-perfect layout and AI rewriting agents to convert basic sentences into "Action-Metric-Result" bullet points.
* **Outcome:** Generates a downloadable, ATS-friendly PDF in seconds.

### 2️⃣ 📊 ATS Scanner & Salary Predictor
A strict algorithmic analysis of how well a resume matches a specific Job Description (JD).
* **Tech:** Uses **Structured Output** to force the AI to return a specific JSON schema containing a Match Score (0-100), Missing Keywords list, and Salary Prediction (in LPA).
* **Logic:** Hides the "Salary Prediction" unless the candidate crosses a "Hirable" threshold (Gamification).

### 3️⃣ 🤖 AI Career Coach
A context-aware chatbot that acts as a Senior Technical Recruiter.
* **Tech:** Maintains **Chat History** in session state to remember previous context, allowing users to practice mock interviews or ask roadmap questions.

---

## 🏗️ Technical Architecture (The "Hard Stuff")

### 🧠 1. AI Orchestration & Structured Output
Instead of relying on random text generation, this project uses **LangChain with Pydantic Models**.
* **Problem:** LLMs often "hallucinate" or give unstructured text that breaks the UI.
* **Solution:** I implemented strict `Pydantic` classes (e.g., `ATSAnalysis`) to define exactly what fields the AI *must* return (e.g., `is_hirable: bool`, `salary: str`).
* **Result:** This ensures 100% reliable data parsing for the frontend dashboards.

### 🔄 2. State Management & Data Flow
The application uses a **Centralized Session State** architecture.
* **Workflow:** When a user generates a resume on *Page 1*, the data is stored in `st.session_state['resume_text']`.
* **Benefit:** When the user navigates to *Page 2 (Scanner)*, the app automatically retrieves this stored context. This creates a seamless, "Super App" experience where pages talk to each other without forcing the user to re-upload files.

### ⚡ 3. Rapid Prototyping & GenAI Integration
* **Philosophy:** This project follows a **"Backend-First"** approach.
* **Execution:** While I architected the complex AI logic and Python backend manually, I leveraged **Generative AI** to accelerate the frontend development (CSS styling, responsive layouts).
* **Impact:** This allowed me to focus 90% of my development time on solving business logic (chains, prompts, and validation) rather than debugging CSS pixels.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **LLM** | Google Gemini 2.5 Flash-Lite | High-speed, low-latency reasoning |
| **Orchestration** | LangChain | Managing prompts, chains, and memory |
| **Validation** | Pydantic | Enforcing strict JSON output schemas |
| **Frontend** | Streamlit | Responsive UI and State Management |
| **PDF Engine** | PyPDF2 / FPDF | Text extraction and PDF generation |
| **Environment** | Python 3.10+ | Core language |

---

## 🚀 Installation & Setup

**1. Clone the Repository**
```bash
git clone [https://github.com/yourusername/CareerForge-AI.git](https://github.com/yourusername/CareerForge-AI.git)
cd CareerForge-AI
```

**2. Install Dependencies**

```bash
pip install -r requirements.txt
```

**3. Set up API Keys**
Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

**4. Run the Application**

```bash
streamlit run app.py
```

---

## 🔮 Future Improvements

* **Database Integration:** Saving user profiles and history using PostgreSQL/Supabase.
* **RAG Implementation:** Allowing the Chatbot to "read" the user's uploaded resume to give more specific advice.
* **Dashboard Analytics:** Tracking improvement scores over time.

---

<div align="center">
<small>Built with ❤️ by <b>Dev Doshi</b> | Powered by Google Gemini & LangChain</small>
</div>

