import React, { useState } from 'react';
import axios from 'axios';
import { Download, Loader2, Sparkles } from 'lucide-react';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    profile_name: '',
    email: '',
    phone: '',
    github: '',
    summary: '',
    skills: '',
    projects: '',
    experience: '',
    education: '',
    other_info: '',
    achievements: '',
    job_desc: '',
    template_choice: 'Modern (Bold Header)',
    theme_color: '#1A237E'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/resume/generate', formData);
      setResult(response.data);
      // Store in session storage for the ATS scanner
      const fullText = `${response.data.ai_data.summary}\n\nSKILLS: ${response.data.ai_data.skills.join(', ')}\n\nEXPERIENCE: ${response.data.ai_data.experience.join('\n')}\n\nPROJECTS: ${response.data.ai_data.projects.join('\n')}`;
      sessionStorage.setItem('resume_text', fullText);
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${result.pdf_base64}`;
    link.download = `${formData.profile_name}_Resume.pdf`;
    link.click();
  };

  return (
    <div className="builder-page container" style={{ padding: '4rem 0' }}>
      <header style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Resume Architect</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
          Refine your professional identity. Provide your raw details, and let our AI architect a narrative that resonates.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="editorial-form">
        <div className="form-section">
          <h3>1. Profile Details</h3>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div className="input-group">
              <label>Full Name</label>
              <input name="profile_name" value={formData.profile_name} onChange={handleChange} placeholder="e.g. John Doe" required />
              <label style={{ marginTop: '1rem' }}>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              <label style={{ marginTop: '1rem' }}>LinkedIn / GitHub URL</label>
              <input name="github" value={formData.github} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="input-group">
              <label>Education</label>
              <textarea name="education" value={formData.education} onChange={handleChange} placeholder="B.Tech Computer Science, GTU (2021-2025)\nCGPA: 8.5/10" style={{ height: '115px' }} />
            </div>
          </div>
        </div>

        <div className="editorial-divider"></div>
        
        <div className="form-section">
          <h3>2. Target Role (Crucial for AI)</h3>
          <div className="input-group">
            <label>Paste the Job Description here</label>
            <textarea name="job_desc" value={formData.job_desc} onChange={handleChange} placeholder="The AI will optimize your resume keywords based on this description..." style={{ height: '100px' }} />
          </div>
        </div>

        <div className="editorial-divider"></div>

        <div className="form-section">
          <h3>3. Experience & Skills</h3>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="left-col">
              <div className="input-group">
                <label>Summary (Rough Draft)</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="I am a student good at python..." style={{ height: '150px' }} />
              </div>
              <div className="input-group">
                <label>Technical Skills (Comma separated)</label>
                <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="Python, Java, Streamlit..." style={{ height: '100px' }} />
              </div>
              <div className="input-group">
                <label>Work Experience</label>
                <textarea name="experience" value={formData.experience} onChange={handleChange} placeholder="Intern at TechCorp: Did web scraping..." style={{ height: '200px' }} />
              </div>
            </div>
            <div className="right-col">
              <div className="input-group">
                <label>Projects</label>
                <textarea name="projects" value={formData.projects} onChange={handleChange} placeholder="Movie Recommender: Used Python and Pandas..." style={{ height: '200px' }} />
              </div>
              <div className="input-group">
                <label>Achievements / Certifications</label>
                <textarea name="achievements" value={formData.achievements} onChange={handleChange} placeholder="Winner of Hackathon 2024..." style={{ height: '100px' }} />
              </div>
              <div className="input-group">
                <label>Languages / Hobbies</label>
                <textarea name="other_info" value={formData.other_info} onChange={handleChange} placeholder="English, French | Photography, Chess" style={{ height: '150px' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="editorial-divider"></div>

        <div className="form-actions" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'GENERATE NARRATIVE'}
          </button>
          
          {result && (
            <button type="button" onClick={downloadPdf} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} /> DOWNLOAD PDF
            </button>
          )}
        </div>
      </form>

      {result && (
        <div className="preview-section glass" style={{ marginTop: '4rem', padding: '4rem' }}>
          <h3 style={{ marginBottom: '2rem' }}>Architected Strategy</h3>
          <div className="strategy-content">
            <p style={{ fontStyle: 'italic', fontSize: '1.2rem', color: '#333', marginBottom: '2rem' }}>"{result.ai_data.summary}"</p>
            <div className="editorial-divider" style={{ opacity: 0.3 }}></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1.5rem', color: '#888' }}>CORE COMPETENCIES</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {result.ai_data.skills.map((s, i) => (
                    <span key={i} style={{ border: '1px solid #ddd', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1.5rem', color: '#888' }}>PROJECT ARCHITECTURE</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {result.ai_data.projects.slice(0, 3).map((p, i) => (
                    <li key={i} style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#555' }}>• {p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .editorial-form {
          max-width: 800px;
        }
        .form-section h3 {
          font-size: 2rem;
          margin-bottom: 2rem;
        }
        .input-group {
          margin-bottom: 2rem;
        }
        .input-group label {
          display: block;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.8rem;
          color: #888;
        }
        .input-group input, .input-group textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          background: #fafafa;
          font-family: var(--font-ui);
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }
        .input-group input:focus, .input-group textarea:focus {
          outline: none;
          border-color: var(--text-primary);
          background: white;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;
