import streamlit as st
import sys
import os
from PyPDF2 import PdfReader

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from LangChain_model import analyze_resume_with_ai
except ImportError:
    st.error("⚠️ Error: Could not find 'LangChain_model.py'. Make sure it exists in the main folder.")
    st.stop()

st.set_page_config(page_title="ATS Scanner", page_icon="📊", layout="wide")
st.title("📊 ATS Resume Score & Salary Predictor")
st.markdown("Check if your resume is ready for the real world.")

st.subheader("1. Target Job Description")
job_description = st.text_area(
    "Paste the JD here:", 
    placeholder="e.g. We are looking for a Python Developer with 2 years of experience...",
    height=150
)

st.divider()

st.subheader("2. Your Resume")
input_method = st.radio("How do you want to provide your resume?", ["Upload PDF File", "Import from Builder / Paste Text"])

resume_text = ""

if input_method == "Upload PDF File":
    uploaded_file = st.file_uploader("Upload your existing Resume (PDF)", type="pdf")
    if uploaded_file is not None:
        try:
            reader = PdfReader(uploaded_file)
            for page in reader.pages:
                resume_text += page.extract_text()
            st.success("✅ PDF Loaded Successfully!")
        except Exception as e:
            st.error(f"Error reading PDF: {e}")

else: 
    default_text = ""
    if 'resume_text' in st.session_state:
        default_text = st.session_state['resume_text']
        st.info("💡 I found content from the Resume Builder! I've pre-filled it below.")
    
    resume_text = st.text_area("Resume Content", value=default_text, height=300, placeholder="Paste your resume text here...")

st.divider()

if st.button("🚀 Analyze Resume"):
    if not job_description:
        st.error("⚠️ Please paste a Job Description first.")
    elif not resume_text:
        st.error("⚠️ Please provide a resume (Upload or Paste).")
    else:
        with st.spinner("🤖 Analyzing Keyword Match & Salary..."):
                try:
                    analysis = analyze_resume_with_ai(resume_text, job_description)
                except Exception as e:
                    st.warning("⚠️ Whoa! High Traffic Alert. 🚦\n\nToo many people are scanning resumes right now (Thank you LinkedIn!). Please wait 30 seconds and try again.")
                    st.stop()
                
                st.markdown("### 🎯 Final Verdict")
                
                if analysis.is_hirable:
                    st.balloons()
                    st.success(f"✅ **YOU ARE HIRED!** \n\nBased on your profile, you are a strong match for the **{analysis.recommended_role}** position.")
                else:
                    st.error(f"⚠️ **NOT SELECTED** \n\nCurrently, your profile does not meet the requirements for **{job_description}**. You need to upskill.")

                st.divider()
                
                if analysis.is_hirable:
                    # SHOW 4 COLUMNS (With Salary)
                    c1, c2, c3, c4 = st.columns(4)
                    with c1: st.metric("ATS Score", f"{analysis.ats_score}%")
                    with c2: st.metric("Role", analysis.recommended_role)
                    with c3: st.metric("Readiness", analysis.placement_readiness)
                    with c4: st.metric("✨ Est. Salary", analysis.salary_estimation)
                else:
                    # SHOW 3 COLUMNS (No Salary)
                    c1, c2, c3 = st.columns(3)
                    with c1: st.metric("ATS Score", f"{analysis.ats_score}%")
                    with c2: st.metric("Role", analysis.recommended_role)
                    with c3: st.metric("Readiness", analysis.placement_readiness)

                st.divider()
               
                st.subheader("🚨 Critical Missing Skills")
                if analysis.missing_keywords:
                    st.error(f"Missing: {', '.join(analysis.missing_keywords)}")
                else:
                    st.success("All keywords matched!")
                
                st.subheader("💡 Improvement Plan")
                for tip in analysis.improvement_tips:
                    st.info(f"• {tip}")
