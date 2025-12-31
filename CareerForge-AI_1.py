import streamlit as st
import requests
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
/* ==============================
   THEME VARIABLES (AUTO LIGHT/DARK)
================================ */
:root {
    --bg-primary: #f5f7fa;
    --bg-secondary: #ffffff;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --border-color: rgba(0,0,0,0.08);
    --glass-bg: rgba(255,255,255,0.85);
    --glass-border: rgba(255,255,255,0.2);
    --shadow-soft: 0 10px 30px rgba(0,0,0,0.08);
    --shadow-hover: 0 25px 60px rgba(0,0,0,0.15);
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg-primary: #0f172a;
        --bg-secondary: #020617;
        --text-primary: #f9fafb;
        --text-secondary: #9ca3af;
        --border-color: rgba(255,255,255,0.1);
        --glass-bg:  linear-gradient(
        135deg,
        rgba(255,75,75,0.15),
        rgba(255,145,77,0.12)
    );
        --glass-border: rgba(255,255,255,0.08);
        --shadow-soft: 0 10px 40px rgba(0,0,0,0.6);
        --shadow-hover: 0 35px 80px rgba(0,0,0,0.9);
    }
}

/* ==============================
   GLOBAL RESET
================================ */
html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-secondary);
    color: var(--text-primary);
}

/* ==============================
   HIDE STREAMLIT DEFAULT UI
================================ */
#MainMenu, footer, header { visibility: hidden; }

/* ==============================
   HERO SECTION
================================ */
.hero-container {
    padding: 4rem 2rem;
    background: linear-gradient(
        135deg,
        rgba(255,75,75,0.15),
        rgba(255,145,77,0.12)
    );
    backdrop-filter: blur(14px);
    border-radius: 22px;
    margin-bottom: 3rem;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border-color);
}

/* ==============================
   HEADINGS
================================ */
.main-heading {
    font-size: 3.6rem;
    font-weight: 800;
    background: linear-gradient(90deg, #FF4B4B, #FF914D);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.sub-heading {
    font-size: 1.2rem;
    color: var(--text-secondary);
    line-height: 1.7;
}

/* ==============================
   FEATURE CARDS (GLASS)
================================ */
.feature-card {
    background:  linear-gradient(
        135deg,
        rgba(255,75,75,0.15),
        rgba(255,145,77,0.12)
    );
    backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    padding: 2rem;
    text-align: center;
    transition: all 0.35s ease;
    box-shadow: var(--shadow-soft);
}

.feature-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: var(--shadow-hover);
    border-color: #FF4B4B;
}

/* ==============================
   BUTTONS
================================ */
div.stButton > button {
    background: linear-gradient(90deg, #FF4B4B, #FF914D);
    color: white;
    border-radius: 999px;
    font-weight: 600;
    padding: 0.65rem 1.6rem;
    transition: all 0.3s ease;
}

div.stButton > button:hover {
    transform: scale(1.04);
    box-shadow: 0 12px 35px rgba(255,75,75,0.4);
}

/* ==============================
   NAV LINKS
================================ */
a[data-testid="stPageLink-NavLink"] {
    background: var(--glass-bg);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding: 15px;
    transition: all 0.3s ease;
}

a[data-testid="stPageLink-NavLink"]:hover {
    background: rgba(255,75,75,0.08);
    border-color: #FF4B4B;
    transform: translateX(6px);
}

/* ==============================
   LOTTIE ANIMATION ENHANCEMENT
================================ */
[data-testid="stLottie"] {
    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.35));
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
    100% { transform: translateY(0px); }
/* ==============================
   SMART FOOTER 
================================ */
.footer {
    text-align: center;
    padding: 14px;
    border-radius: 8px;
    margin-top: 40px;
    font-family: 'Inter', sans-serif;

    /* Light mode */
    background: linear-gradient(
        135deg,
        rgba(255, 75, 75, 0.08),
        rgba(255, 145, 77, 0.08)
    );
    color: #000 !important;   
    border: 1px solid rgba(255, 75, 75, 0.2);
}

/* Force all children to inherit color */
.footer p,
.footer small,
.footer b,
.footer span {
    color: inherit !important;
}

/* ==============================
   DARK MODE
================================ */
@media (prefers-color-scheme: dark) {
    .footer {
        background: linear-gradient(
            135deg,
            rgba(255, 75, 75, 0.18),
            rgba(255, 145, 77, 0.18)
        );
        color: #ffffff !important;  
        text-align: center;
        border: 1px solid rgba(255, 75, 75, 0.35);
    }
}
</style>
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

# --- FOOTER ---
st.write("##")
st.markdown(
    """
    <div class="footer">
        <p><b>CareerForge AI</b> &copy; 2025 | Powered by Google Gemini 2.5 Flash</p>
        <p style="font-size: 0.9rem; opacity: 0.8;">Built with ❤️ by Dev Doshi</p>
    </div>
    """, 
    unsafe_allow_html=True
)