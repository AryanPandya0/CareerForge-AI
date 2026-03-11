# CareerForge AI

> 🔴 **Live Demo:** https://careerforge-ai.streamlit.app/

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Streamlit](https://img.shields.io/badge/Streamlit-UI-red)
![LangChain](https://img.shields.io/badge/LangChain-Orchestration-green)
![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-orange)

---

## What is this?

I built this because I kept seeing people struggle with the same three things — their resume wasn't passing ATS filters, they didn't know what salary to expect, and they had no idea what a recruiter actually looks for.

So I built one tool that handles all of it.

CareerForge AI lets you scan your resume against a job description, build a formatted resume from scratch, and chat with an AI that acts like a senior recruiter giving you honest feedback. Not a wrapper around an API — actual logic, structured output, and a UI that doesn't make you want to close the tab.

---

## What it does

**Resume Builder**
You fill in your info, it does the rest. The AI rewrites your bullet points into proper action-metric-result format and generates a clean, download-ready PDF in seconds. Two styles — Modern (with color accents) and Classic.

**ATS Scanner**
Paste your resume and a job description. It runs a structured analysis and returns a match score out of 100, the keywords you're missing, and a salary estimate. The salary only shows up if you cross the "hirable" threshold — added that as a small motivator to actually improve the resume.

**AI Career Coach**
A chatbot that remembers the conversation. You can use it to practice mock interview questions, ask about roadmaps, or just get honest feedback on your resume. It reads the context from what you've already built in the app — no re-uploading needed.

---

## The part that actually took effort

The easiest thing to do was prompt an LLM and print whatever it says. I didn't do that.

Every AI output in this app goes through a **Pydantic schema** — meaning the model is forced to return specific fields in a specific format. `is_hirable`, `match_score`, `missing_keywords`, `salary_estimate` — all validated before they touch the UI. If the model tries to freestyle, it fails and retries. This is why the scanner dashboard never breaks or shows garbage data.

The other thing I'm proud of is the **session state architecture**. When you build your resume on page 1, that data is stored in session state. When you go to the scanner on page 2, it's already there. The pages talk to each other. It feels like one app, not three disconnected pages.

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

