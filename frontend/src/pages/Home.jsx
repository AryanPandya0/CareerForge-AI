import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Target, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero container">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Architect your career with precision.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A minimal toolkit for the modern professional. AI-powered resume building, ATS scanning, and career coaching redefined.
        </motion.p>
        <motion.div 
          className="hero-btns"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/builder" className="btn-primary" style={{ marginRight: '1rem' }}>GET STARTED</Link>
          <Link to="/scanner" className="btn-secondary">SCAN RESUME</Link>
        </motion.div>
      </section>

      <div className="editorial-divider container"></div>

      <section className="features container">
        <div className="section-grid">
          <div className="card glass">
            <FileText size={32} strokeWidth={1} style={{ marginBottom: '1.5rem' }} />
            <h3>Resume Architect</h3>
            <p>Transform raw experience into a professional narrative designed for high-end technical roles.</p>
          </div>
          <div className="card glass">
            <Target size={32} strokeWidth={1} style={{ marginBottom: '1.5rem' }} />
            <h3>ATS Intelligence</h3>
            <p>Algorithmically score your resume against job specifications. Discover the hidden keywords you're missing.</p>
          </div>
          <div className="card glass">
            <Bot size={32} strokeWidth={1} style={{ marginBottom: '1.5rem' }} />
            <h3>Editorial Coach</h3>
            <p>A context-aware AI partner to refine your interview presence and career roadmap.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works container" style={{ padding: '8rem 0' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '4rem', textAlign: 'center' }}>The Process</h2>
        <div className="process-grid">
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>01. INPUT</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Provide your raw data or upload an existing profile.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>02. REFINE</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Our AI architect structures and elevates your professional narrative.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>03. ANALYZE</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Compare against target specifications to ensure perfection.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>04. EXECUTE</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Download your polished PDF and secure your next role.</p>
          </div>
        </div>
      </section>

      <style>{`
        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .process-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .process-grid { grid-template-columns: 1fr; }
          .how-it-works { padding: 4rem 0 !important; }
          .how-it-works h2 { font-size: 2.5rem !important; margin-bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
