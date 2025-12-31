import streamlit as st
from fpdf import FPDF
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from LangChain_model import generate_resume_data

def clean_text(text):
    if not text: return ""
    replacements = {
        "\u2013": "-", "\u2014": "-", "\u2018": "'", 
        "\u2019": "'", "\u201c": '"', "\u201d": '"', 
        "\u2022": "*"
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    # Ensure PDF compatibility (Latin-1 encoding)
    return text.encode('latin-1', 'replace').decode('latin-1')

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

class PDF(FPDF):
    def __init__(self, brand_color=(0, 0, 128)):
        super().__init__()
        self.brand_color = brand_color

    def header(self):
        pass

    def add_modern_header(self, name, contact_info):
        name = clean_text(name)
        contact_info = clean_text(contact_info)
        
        # 1. Full Width Colored Box
        self.set_fill_color(*self.brand_color)
        self.rect(0, 0, 210, 35, 'F') 
        
        # 2. Name (White, Large, Bold)
        self.set_text_color(255, 255, 255)
        self.set_font('Arial', 'B', 24)
        self.set_xy(10, 12)
        self.cell(0, 10, name.upper(), 0, 1, 'C')
        
        # 3. Contact Info (White, Smaller)
        self.set_font('Arial', '', 10)
        self.set_xy(10, 28)
        self.cell(0, 5, contact_info, 0, 1, 'C')
        
        self.ln(20)

    def add_classic_header(self, name, contact_info):
        name = clean_text(name)
        contact_info = clean_text(contact_info)
        
        # 1. Name (Colored, Large)
        self.set_text_color(*self.brand_color)
        self.set_font('Arial', 'B', 22)
        self.cell(0, 10, name.upper(), 0, 1, 'C')
        
        # 2. Contact Info (Dark Grey)
        self.set_text_color(80, 80, 80)
        self.set_font('Arial', '', 10)
        self.cell(0, 5, contact_info, 0, 1, 'C')
        
        # 3. Horizontal Line
        self.set_draw_color(*self.brand_color)
        self.set_line_width(0.5)
        self.line(10, 32, 200, 32) 
        self.ln(15)

    def section_title(self, title):
        title = clean_text(title)
        self.set_font('Arial', 'B', 12)
        self.set_text_color(*self.brand_color)
        self.cell(0, 8, title.upper(), 0, 1, 'L')
        
        curr_y = self.get_y() - 1 
        self.set_draw_color(*self.brand_color)
        self.set_line_width(0.3)  
        self.line(10, curr_y, 200, curr_y) 
        self.set_line_width(0.2)  
        self.ln(2)

    def section_body(self, text):
        text = clean_text(text)
        self.set_text_color(40, 40, 40)
        self.set_font('Arial', '', 10)
        self.multi_cell(0, 5, text)
        self.ln(3)

    def bullet_points(self, items):
        self.set_font('Arial', '', 10)
        self.set_text_color(40, 40, 40)
        for item in items:
            item = clean_text(item)
            self.cell(6) # Indent
            self.cell(4, 5, chr(127), 0, 0) # Bullet char
            self.multi_cell(0, 5, item)
        self.ln(3)

st.set_page_config(page_title="Resume Builder", page_icon="📝", layout="wide")

with st.sidebar:
    st.header("🎨 Design Studio")
    template_choice = st.radio("Choose Template", ["Modern (Bold Header)", "Classic (Minimal)"])
    theme_color = st.color_picker("Accent Color", "#1A237E") 
    rgb_color = hex_to_rgb(theme_color)
    
    st.divider()
    st.info("💡 **Pro Tip:** Use 'Classic' for Finance/Law roles and 'Modern' for Tech/Creative roles.")

st.title("📝 Resume Builder")
st.markdown("Transform your rough notes into a **High-Impact PDF**.")

with st.form("resume_form"):
    st.subheader("1. Profile Details")
    c1, c2, c3 = st.columns(3)
    with c1: 
        profile_name = st.text_input("Full Name", placeholder="e.g. John Doe")
        email = st.text_input("Email", placeholder="john@example.com")
    with c2: 
        phone = st.text_input("Phone", placeholder="+91 98765 43210")
        github = st.text_input("LinkedIn / GitHub URL")
    with c3:
        education = st.text_area("Education", placeholder="B.Tech Computer Science, GTU (2021-2025)\nCGPA: 8.5/10")

    st.divider()
    
    st.subheader("2. Target Role (Crucial for AI)")
    job_desc = st.text_area("Paste the Job Description here", placeholder="The AI will optimize your resume keywords based on this description...", height=100)
    
    st.divider()

    st.subheader("3. Experience & Skills")
    col_a, col_b = st.columns(2)
    with col_a:
        summary = st.text_area("Summary (Rough Draft)", height=150, placeholder="I am a student good at python...")
        skills = st.text_area("Technical Skills (Comma separated)", height=100, placeholder="Python, Java, Streamlit...")
        experience = st.text_area("Work Experience", height=200, placeholder="Intern at TechCorp: Did web scraping...")
    with col_b:
        projects = st.text_area("Projects", height=200, placeholder="Movie Recommender: Used Python and Pandas...")
        achievements = st.text_area("Achievements / Certifications", height=100)
        other_info = st.text_area("Languages / Hobbies", height=150)

    submitted = st.form_submit_button("🚀 Generate Professional Resume", type="primary")

if submitted:
    if not profile_name or not skills:
        st.warning("⚠️ Please enter at least your Name and Skills.")
    else:
        with st.spinner("🤖 AI Architect is drafting your resume... (This takes ~10 seconds)"):
            try:
                # 1. CALL THE AI BRAIN
                ai_data = generate_resume_data(
                    profile_name, summary, skills, projects, 
                    experience, education, other_info, achievements, job_desc
                )
                
                # 2. SAVE TO SESSION STATE (For the ATS Scanner Page)
                full_resume_text = f"{ai_data.summary}\n\nSKILLS: {', '.join(ai_data.skills)}\n\nEXPERIENCE: {ai_data.experience}\n\nPROJECTS: {ai_data.projects}"
                st.session_state['resume_text'] = full_resume_text
                
                # 3. GENERATE PDF
                pdf = PDF(brand_color=rgb_color)
                pdf.add_page()
                
                contact_info = f"{email}  |  {phone}  |  {github}"

                if template_choice == "Modern (Bold Header)":
                    pdf.add_modern_header(ai_data.profile_name, contact_info)
                else:
                    pdf.add_classic_header(ai_data.profile_name, contact_info)

                # Define the sections
                sections = [
                    ("Professional Summary", ai_data.summary, "text"),
                    ("Technical Skills", ", ".join(ai_data.skills), "text"),
                    ("Work Experience", ai_data.experience, "bullets"),
                    ("Key Projects", ai_data.projects, "bullets"),
                    ("Education", ai_data.education, "text")
                ]

                # Loop through sections
                for title, content, style in sections:
                    pdf.section_title(title)
                    if style == "text":
                        pdf.section_body(content)
                    else:
                        pdf.bullet_points(content)

                if ai_data.achievements:
                    pdf.section_title("Honors & Awards")
                    pdf.bullet_points(ai_data.achievements)
                
                if ai_data.other_information:
                    pdf.section_title("Additional Details")
                    pdf.section_body(ai_data.other_information)

                # 4. OUTPUT
                pdf_bytes = pdf.output(dest='S').encode('latin-1')
                
                st.balloons()
                st.success("✅ Resume Generated Successfully!")
                st.info("👉 **Next Step:** Go to the 'ATS Scanner' page to see how well this resume scores!")
                
                st.download_button(
                    label="📥 Download PDF Resume",
                    data=pdf_bytes,
                    file_name=f"{profile_name}_Resume.pdf",
                    mime="application/pdf"
                )

            except Exception as e:
                st.error(f"❌ Error during generation: {str(e)}")