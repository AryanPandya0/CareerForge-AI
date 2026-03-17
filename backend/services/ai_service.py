from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from pydantic import BaseModel, Field
from typing import List, Optional
from tenacity import retry, stop_after_attempt, wait_fixed
import os
import random

def get_random_gemini_key():
    keys = []
    for key, value in os.environ.items():
        if key.startswith("GEMINI_KEY_") or key == "GOOGLE_API_KEY":
            keys.append(value)

    if keys:
        return random.choice(keys)
    else:
        raise ValueError("No GEMINI_KEY_ or GOOGLE_API_KEY found in environment variables.")

class ResumeDataSchema(BaseModel):
    profile_name: str = Field(..., description="The full name of the user.")
    summary: str = Field(..., description="A polished, professional summary (max 3-4 lines).")
    skills: List[str] = Field(..., description="List of top 8-10 technical skills.")
    projects: List[str] = Field(..., description="List of projects, rewritten in 'Action-Metric-Result' format.")
    experience: List[str] = Field(..., description="List of job roles, rewritten professionally with action verbs.")
    education: str = Field(..., description="Formatted educational background.")
    other_information: str = Field(..., description="Formatted additional info (Languages, Hobbies).")
    achievements: List[str] = Field(..., description="List of formatted achievements.")

class ATSAnalysisSchema(BaseModel):
    ats_score: int = Field(..., description="A score out of 100 based on the match between Resume and Job Description.")
    recommended_role: str = Field(..., description="The best matching job title.")
    missing_keywords: List[str] = Field(..., description="List of technical skills or keywords missing in the Resume.")
    placement_readiness: str = Field(..., description="A verdict: 'High', 'Medium', or 'Low' readiness for the job.")
    is_hirable: bool = Field(..., description="True if the candidate is job-ready.")
    salary_estimation: str = Field(..., description="Estimated salary range in 'LPA' format.")
    improvement_tips: List[str] = Field(..., description="3 specific, actionable tips to improve the resume.")

def generate_resume_data(name, summary, skills, projects, exp, edu, other, awards, job_desc):
    api_key = get_random_gemini_key()
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite", 
        temperature=0.6, 
        google_api_key=api_key
    )
    structured_model = model.with_structured_output(ResumeDataSchema)

    template = """
    ### SYSTEM ROLE: Elite Resume Architect (FAANG Specialist)
    You are rewriting a resume for a candidate targeting a high-level tech role. 
    The user has provided **RAW, UNDERSTATED notes**. Your job is to **reverse-engineer** their work and describe it using **High-Level Engineering Terminology**.

    ### TARGET JOB DESCRIPTION:
    "{job_desc}"

    ### 🛡️ THE "NO-FLUFF" PROTOCOL:
    1. **Quantify Everything:** Never write a sentence without a number. If the user doesn't give a number, **ESTIMATE** a realistic engineering metric.
    2. **Strong Openers:** Architected, Orchestrated, Engineered, Deployed, Optimized, Spearheaded.
    3. **Tech-First Tone:** Use words like "Scalability," "Latency," "Throughput," "CI/CD," "Microservices."

    ### 📝 INSTRUCTIONS BY SECTION (STRICT):
    - SUMMARY: 3-sentence narrative.
    - PROJECTS: Multi-faceted bullet points (Architecture, Optimization, Impact).
    - WORK EXPERIENCE: Action -> Context -> Result.
    - SKILLS: Grouped logically.

    ### 📥 RAW USER INPUTS:
    - Name: {profile_name}
    - Draft Summary: {summary}
    - Skills: {skills}
    - Projects: {projects}
    - Experience: {experience}
    - Education: {education}
    - Awards: {achievements}
    - Other: {other_information}
    """
    prompt = PromptTemplate(
        template=template,
        input_variables=["profile_name", "summary", "skills", "projects", "experience", "education", "achievements", "other_information", "job_desc"],
    )
    chain = prompt | structured_model
    return chain.invoke({
        "profile_name": name, "summary": summary, "skills": skills, "projects": projects,
        "experience": exp, "education": edu, "achievements": awards,
        "other_information": other, "job_desc": job_desc
    })

def analyze_resume_with_ai(resume_text, job_description):
    api_key = get_random_gemini_key()
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash", 
        temperature=0.6, 
        google_api_key=api_key
    )
    ats_structured_model = model.with_structured_output(ATSAnalysisSchema)

    template = """
    ### ROLE: Senior Technical Recruiter (India Market Specialist)
    You are evaluating a candidate's resume against a specific Job Description (JD). 

    ### JOB DESCRIPTION:
    "{job_desc}"
    
    ### CANDIDATE RESUME:
    "{resume_text}"
    
    ### 🚨 CRITICAL DOMAIN CHECK:
    - Score 0-10% if domains mismatch significantly.

    ### SCORING RULES:
    1. JD Match score.
    2. Salary Estimation (India Market): Fresher: 3-9 LPA, Junior: 6-11 LPA, Mid: 10-18 LPA, Senior: 16-30+ LPA.
    3. Hirable Verdict: True only if Score > 75%.
    """
    prompt = PromptTemplate(
        template=template,
        input_variables=["resume_text", "job_desc"],
    )
    chain = prompt | ats_structured_model
    return chain.invoke({"resume_text": resume_text, "job_desc": job_description})

@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def get_chat_response(user_query, chat_history):
    api_key = get_random_gemini_key()
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite", 
        temperature=0.6, 
        google_api_key=api_key
    )
    template = """
    You are an expert Career Coach and Tech Interviewer named 'CareerForge AI'.
    Help with interview prep, tech concepts, and roadmap advice. Be professional and concise.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", template),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{query}")
    ])
    chain = prompt | model | StrOutputParser()
    return chain.invoke({"chat_history": chat_history, "query": user_query})
