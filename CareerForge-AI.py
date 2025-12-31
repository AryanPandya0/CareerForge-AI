import streamlit as st
import requests
import textwrap
from streamlit_lottie import st_lottie

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="CareerForge AI",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- ASSETS & LOADER FUNCTIONS (CRASH PROOF) ---
@st.cache_data
def load_lottieurl(url: str):
    try:
        r = requests.get(url)
        if r.status_code != 200:
            return None
        return r.json()
    except Exception as e:
        # If the URL is bad or not JSON, return None to prevent crash
        return None

# Load Assets (Using Verified Raw JSON Links)
# Note: These are direct JSON links, not "embed" links.
lottie_hero = load_lottieurl("https://lottie.host/5a072973-196d-4078-8319-9524d673595d/2J6Q2k9x8Z.json") 
lottie_resume = load_lottieurl("https://lottie.host/801a2f16-681b-4177-b353-8328c6846152/p0PjL0k2s5.json") 
lottie_bot = load_lottieurl("https://lottie.host/9f6d47d6-7c18-4e8c-8438-2d8869c94833/9sKq5x2Pj7.json")

st.markdown("""
<style>

/* =================================================
   GLOBAL RESET & SMOOTHNESS
================================================= */
html {
    scroll-behavior: smooth;
}

html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
    transition: background-color 0.4s ease, color 0.4s ease;
}

/* =================================================
   BRAND VARIABLES
================================================= */
:root {
    --brand-grad: linear-gradient(90deg, #FF4B4B, #FF914D);
    --brand-color: #FF6A3D;
}

/* =================================================
   STREAMLIT LIGHT MODE
================================================= */
.stApp[data-theme="light"] {
    --bg-main: #ffffff;
    --bg-soft: #f5f7fa;
    --glass-bg: rgba(255,255,255,0.85);
    --glass-border: rgba(0,0,0,0.08);
    --text-main: #000000;
    --text-sub: #444444;
    --shadow-soft: 0 10px 30px rgba(0,0,0,0.08);
    --shadow-hover: 0 30px 80px rgba(255,106,61,0.25);
}

/* =================================================
   STREAMLIT DARK MODE
================================================= */
.stApp[data-theme="dark"] {
    --bg-main: #020617;
    --bg-soft: #020617;
    --glass-bg: rgba(15,23,42,0.75);
    --glass-border: rgba(255,255,255,0.08);
    --text-main: #ffffff;
    --text-sub: #cbd5f5;
    --shadow-soft: 0 20px 45px rgba(0,0,0,0.65);
    --shadow-hover: 0 35px 90px rgba(255,106,61,0.45);
}

/* =================================================
   PAGE BASE
================================================= */
.stApp {
    background-color: var(--bg-main);
    color: var(--text-main);
}

/* =================================================
   NAVBAR
================================================= */
.navbar {
    position: sticky;
    top: 0;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 30px;
    margin-bottom: 25px;
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border-radius: 10px;
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-soft);
}

.logo {
    font-weight: 800;
    font-size: 1.1rem;
    background: var(--brand-grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-right a {
    margin-left: 22px;
    text-decoration: none;
    font-weight: 600;
    color: var(--text-main);
    transition: color 0.3s ease;
}

.nav-right a:hover {
    color: var(--brand-color);
}

/* =================================================
   HEADINGS
================================================= */
.main-heading {
    font-size: 3.6rem;
    font-weight: 800;
    background: var(--brand-grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.sub-heading {
    font-size: 1.2rem;
    color: var(--text-sub);
    line-height: 1.7;
}

/* =================================================
   FEATURE CARDS (GLASS)
================================================= */
.feature-card {
    background: var(--glass-bg);
    backdrop-filter: blur(18px);
    border-radius: 18px;
    padding: 2rem;
    text-align: center;
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-soft);
    transition: all 0.35s ease;
}

.feature-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--shadow-hover);
    border-color: var(--brand-color);
}

/* ==============================
   BUTTONS (MATCH IMAGE STYLE)
================================ */
div.stButton > button {
    background: rgba(255, 145, 77, 0.18);   /* soft peach */
    color: var(--text-main);
    border: 1.6px solid rgba(255, 75, 75, 0.65);
    border-radius: 14px;                   /* slightly rounded, not pill */
    font-weight: 600;
    padding: 0.2rem 1.1rem;
    transition: all 0.25s ease;
}

/* hover */
div.stButton > button:hover {
    background: rgba(255, 145, 77, 0.28);
    box-shadow: 0 8px 24px rgba(255, 75, 75, 0.35);
    transform: translateY(-1px);
}

/* focus */
div.stButton > button:focus {
    outline: none;
    box-shadow: none;
}

/* ==============================
   PAGE LINK BUTTON STYLE (FIX)
================================ */
a[data-testid="stPageLink-NavLink"] {
    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(255, 145, 77, 0.18);
    color: var(--text-main) !important;

    border: 1.6px solid rgba(255, 75, 75, 0.65);
    border-radius: 14px;

    font-weight: 600;
    padding: 0.9rem 1.6rem;

    text-decoration: none;
    transition: all 0.25s ease;
}

/* hover */
a[data-testid="stPageLink-NavLink"]:hover {
    background: rgba(255, 145, 77, 0.28);
    box-shadow: 0 8px 24px rgba(255, 75, 75, 0.35);
    transform: translateY(-1px);
}

/* remove focus outline */
a[data-testid="stPageLink-NavLink"]:focus {
    outline: none;
    box-shadow: none;
}


/* =================================================
   LOTTIE FLOAT EFFECT
================================================= */
[data-testid="stLottie"] {
    filter: drop-shadow(0 25px 45px rgba(0,0,0,0.35));
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-16px); }
    100% { transform: translateY(0px); }
}

/* =================================================
   FOOTER (FIXED FOR STREAMLIT)
================================================= */
.footer {
    margin-top: 10px;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-soft);
    color: var(--text-main) !important;
}

/* footer text consistency */
.footer p,
.footer b,
.footer span,
.footer small {
    color: inherit !important;
}

/* muted footer text */
.footer-muted {
    opacity: 0.85;
}

/* =================================================
   OPTIONAL: DARK MODE GLOW
================================================= */
.stApp[data-theme="dark"] .footer {
    text-shadow: 0 0 12px rgba(255,145,77,0.25);
}

</style>
""", unsafe_allow_html=True)

# --- NAVBAR ---
st.markdown("""
<div class="navbar">
    <div class="nav-left">
        <span class="logo">🚀 CareerForge AI</span>
    </div>
    <div class="nav-right">
        <a href="#about">About Me</a>
        <a href="#contact">Contact</a>
    </div>
</div>
""", unsafe_allow_html=True)


# --- HERO SECTION ---
col1,space ,col2 = st.columns([2,1,2], gap="large")

with col1:
    st.write("##") # Spacer
    st.markdown('<div class="main-heading">Architect Your Dream Career with AI</div>', unsafe_allow_html=True)
    st.markdown('<p class="sub-heading">Stop guessing. Start building. CareerForge AI uses advanced Gemini & Llama models to rewrite your resume, predict your salary, and prep you for interviews—all in seconds.</p>', unsafe_allow_html=True)
    
    # Call to Action Buttons
    c_btn1, c_btn2 = st.columns([1, 1])
    with c_btn1:
        st.page_link("pages/1_Resume_Builder.py", label="🚀 Build Resume", icon="📄", use_container_width=True)
    with c_btn2:
        st.page_link("pages/2_ATS_Scanner.py", label="📊 Scan ATS Score", icon="🎯", use_container_width=True)

with col2:
    if lottie_hero:
        st_lottie(lottie_hero, height=400, key="hero_anim")
    else:
        st.image(
            "my_project_image.png", 
            caption="AI Powered Career Architect",
            width=350 
        )

st.write("---")

# --- FEATURES GRID ---
st.markdown("<h2 style='text-align: center; margin-bottom: 2rem;'>Why Choose CareerForge?</h2>", unsafe_allow_html=True)

f1, f2, f3 = st.columns(3, gap="medium")

with f1:
    with st.container(border=True):
        if lottie_resume:
            st_lottie(lottie_resume, height=150, key="resume_anim")
        else:
            st.markdown("<div style='text-align: center; font-size: 3rem;'>📝</div>", unsafe_allow_html=True)
            
        st.markdown("<h3 style='text-align: center;'>AI Resume Builder</h3>", unsafe_allow_html=True)
        st.write("Forget generic templates. Our AI rewrites your messy notes into **'Action-Metric-Result'** bullet points that recruiters love.")
        st.write("##")
        st.page_link("pages/1_Resume_Builder.py", label="Try Builder", use_container_width=True)

with f2:
    with st.container(border=True):
        if lottie_hero: # Reusing hero as placeholder if specific missing
             st.markdown("<div style='text-align: center; font-size: 3rem;'>🔎</div>", unsafe_allow_html=True)
        else:
             st.markdown("<div style='text-align: center; font-size: 3rem;'>🔎</div>", unsafe_allow_html=True)

        st.markdown("<h3 style='text-align: center;'>ATS Scanner</h3>", unsafe_allow_html=True)
        st.write("Don't get rejected by a bot. We score your resume against the Job Description and tell you exactly what keywords are missing.")
        st.write("##")
        st.page_link("pages/2_ATS_Scanner.py", label="Scan Now", use_container_width=True)

with f3:
    with st.container(border=True):
        if lottie_bot:
            st_lottie(lottie_bot, height=150, key="bot_anim")
        else:
            st.markdown("<div style='text-align: center; font-size: 3rem;'>🤖</div>", unsafe_allow_html=True)
            
        st.markdown("<h3 style='text-align: center;'>AI Career Coach</h3>", unsafe_allow_html=True)
        st.write("Nervous about the interview? Practice behavioral questions and get a custom roadmap for your target role.It's")
        st.write("##")
        st.page_link("pages/3_Career_Chatbot.py", label="Chat with AI", use_container_width=True)

# --- HOW IT WORKS (Timeline Style) ---
st.write("---")
st.markdown("<h2 style='text-align: center; margin-bottom: 2rem;'>How It Works</h2>", unsafe_allow_html=True)

step1, step2, step3, step4 = st.columns(4)

with step1:
    st.info("**Step 1**")
    st.markdown("#### Upload Data")
    st.caption("Enter your raw details or upload a rough PDF.")

with step2:
    st.warning("**Step 2**")
    st.markdown("#### AI Magic")
    st.caption("Our LLMs (Gemini/Llama) rewrite and structure your data.")

with step3:
    st.success("**Step 3**")
    st.markdown("#### Analysis")
    st.caption("Check your ATS Score and Estimated Salary.")

with step4:
    st.error("**Step 4**")
    st.markdown("#### Success")
    st.caption("Download your PDF and ace the interview.")

st.markdown("""
<div id="about"></div>
<h2 style="text-align:center; margin-top:3rem;">About Me</h2>

<div class="feature-card" style="max-width:900px; margin: 0 auto;">
<p>
Hi, I’m <b>Dev Doshi</b>, a developer passionate about building intelligent,
design-driven applications using AI and modern web technologies.
I enjoy working with LLMs, Streamlit, and data-driven systems that solve
real-world career and productivity problems.
CareerForge AI is a step toward simplifying career growth using automation.
I believe great tools should be powerful, fast, and beautifully simple.
</p>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div id="contact"></div>
<h2 style="text-align:center; margin-top:3rem;">Contact</h2>

<div class="feature-card" style="max-width:900px; margin: 0 auto; text-align:center;">
    <p>Let’s connect and build something meaningful 🚀</p>
    <p style="font-size:1.1rem;">
        🔗 <a href="https://www.linkedin.com/in/dev-doshi-8360a727b" target="_blank">LinkedIn</a> &nbsp;|&nbsp;
        💻 <a href="https://github.com/devdoshi19" target="_blank">GitHub</a> &nbsp;|&nbsp;
        📸 <a href="https://instagram.com/dev_doshi_" target="_blank">Instagram</a>
    </p>
</div>
""", unsafe_allow_html=True)

# --- FOOTER ---
st.write("##")

st.markdown(
    textwrap.dedent("""
    <div class="footer">
        <p><b>CareerForge AI</b> © 2025 Dev Doshi</p>
        <p class="footer-muted">
            Licensed under the MIT License · Free for personal & educational use
        </p>
        <p><b>CareerForge AI</b> &copy; 2025 | Powered by Google Gemini 2.5 Flash</p>
        <p class="footer-muted">Built with ❤️ by Dev Doshi</p>
    </div>
    """),
    unsafe_allow_html=True
)