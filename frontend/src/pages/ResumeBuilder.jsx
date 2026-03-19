import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';

const API_URL = 'https://careerforge-ypaf.onrender.com';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('resumeBuilderFormData');
    if (saved && saved !== 'undefined' && saved !== 'null') {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) { console.error('Error parsing session data', e); }
    }
    return {
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
    };
  });

  useEffect(() => {
    sessionStorage.setItem('resumeBuilderFormData', JSON.stringify(formData));
  }, [formData]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.profile_name || !formData.skills) {
      setError('⚠️ Please enter at least your Name and Skills.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/resume/generate`, formData);
      setResult(response.data);
      // Store full resume text in session storage for ATS Scanner
      if (response.data.full_resume_text) {
        sessionStorage.setItem('resume_text', response.data.full_resume_text);
      }
    } catch (err) {
      console.error('Error generating resume:', err);
      const detail = err.response?.data?.detail || 'Failed to generate resume. Please try again.';
      setError(`❌ ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    console.log("Download triggered. Result state:", !!result);
    if (!result || !result.pdf_base64) {
      console.error("PDF data missing from state!");
      setError('❌ PDF data is missing. Please generate the resume again.');
      return;
    }

    console.log("Base64 Length:", result.pdf_base64.length);
    console.log("Base64 Preview:", result.pdf_base64.substring(0, 50));

    try {
      // Decode base64 to binary string
      const byteCharacters = atob(result.pdf_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const filename = `${formData.profile_name ? formData.profile_name.replace(/\s+/g, '_') : 'My'}_Resume.pdf`;

      console.log("Attempting saveAs with filename:", filename);
      // Attempt 1: FileSaver
      try {
        saveAs(blob, filename);
        console.log("saveAs called successfully");
      } catch (fsErr) {
        console.error("FileSaver failed, trying fallback anchor:", fsErr);
        // Attempt 2: Fallback Anchor
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("Fallback anchor triggered");
      }

    } catch (err) {
      console.error('Failed to decode/download PDF:', err);
      setError('❌ Failed to construct the PDF file. Please try generating it again.');
    }
  };

  return (
    <div className="builder-page container">
      <header style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>📝 Resume Builder</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
          Transform your rough notes into a <strong>High-Impact PDF</strong>.
        </p>
      </header>

      {error && (
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107', marginBottom: '2rem', color: 'var(--text-primary)', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="editorial-form">
        <div className="form-section">
          <h3>1. Profile Details</h3>
          <div className="form-grid-3">
            <div className="input-group">
              <label>Full Name *</label>
              <input name="profile_name" value={formData.profile_name} onChange={handleChange} placeholder="Aryan Pandya" required />
              <label style={{ marginTop: '1rem' }}>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="dev@gmail.com" />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              <label style={{ marginTop: '1rem' }}>LinkedIn / GitHub URL</label>
              <input name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/username" />
            </div>
            <div className="input-group">
              <label>Education</label>
              <textarea name="education" value={formData.education} onChange={handleChange} placeholder={"B.Tech Computer Science, CVMU (2023-2027)\nCGPA: 8.5/10"} style={{ height: '115px' }} />
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
          <div className="form-grid-2">
            <div>
              <div className="input-group">
                <label>Summary (Rough Draft)</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="I am a student good at python..." style={{ height: '150px' }} />
              </div>
              <div className="input-group">
                <label>Technical Skills (Comma separated) *</label>
                <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="Python, Java, Streamlit..." style={{ height: '100px' }} />
              </div>
              <div className="input-group">
                <label>Work Experience</label>
                <textarea name="experience" value={formData.experience} onChange={handleChange} placeholder="Intern at TechCorp: Did web scraping..." style={{ height: '200px' }} />
              </div>
            </div>
            <div>
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

        <div className="form-section">
          <h3>🎨 Design Studio</h3>
          <div className="design-grid">
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Template</label>
              <select name="template_choice" value={formData.template_choice} onChange={handleChange} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: '0.9rem', borderRadius: '4px' }}>
                <option value="Modern (Bold Header)">Modern (Bold Header)</option>
                <option value="Classic (Minimal)">Classic (Minimal)</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Accent Color</label>
              <input type="color" name="theme_color" value={formData.theme_color} onChange={handleChange} style={{ width: '60px', height: '40px', padding: '2px', border: '1px solid var(--border-color)', cursor: 'pointer', background: 'var(--card-bg)', borderRadius: '4px' }} />
            </div>
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            💡 <strong>Pro Tip:</strong> Use 'Classic' for Finance/Law roles and 'Modern' for Tech/Creative roles.
          </p>
        </div>

        <div className="editorial-divider"></div>

        <div className="form-actions" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? <><Loader2 size={18} className="animate-spin" /> AI is drafting... (takes ~10s)</> : '🚀 Generate Professional Resume'}
          </button>

          {result && (
            <button type="button" onClick={downloadPdf} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} /> 📥 Download PDF Resume
            </button>
          )}
        </div>
      </form>

      {result && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(40, 167, 69, 0.1)', border: '1px solid #28a745', marginBottom: '1rem', color: 'var(--text-primary)', borderRadius: '4px' }}>
            <span style={{ color: '#28a745' }}>✅</span> Resume Generated Successfully!
          </div>
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(0, 123, 255, 0.1)', border: '1px solid #007bff', marginBottom: '2rem', color: 'var(--text-primary)', borderRadius: '4px' }}>
            👉 <strong>Next Step:</strong> Go to the 'Scanner' page to see how well this resume scores!
          </div>

          <div className="preview-section glass" style={{ padding: '3rem' }}>
            <h3 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>AI Generated Data</h3>
            <div>
              <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
                "{result.ai_data.summary}"
              </p>
              <div className="editorial-divider" style={{ opacity: 0.3 }}></div>
              <div className="preview-grid">
                <div>
                  <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>SKILLS</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {result.ai_data.skills.map((s, i) => (
                      <span key={i} style={{ border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--text-primary)', borderRadius: '4px', background: 'var(--card-bg)' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>PROJECTS</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {result.ai_data.projects.slice(0, 3).map((p, i) => (
                      <li key={i} style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>• {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .editorial-form {
          max-width: 900px;
        }
        .form-section h3 {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          color: var(--text-primary);
        }
        
        /* CSS Grids for responsiveness */
        .form-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .design-grid {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .preview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        
        @media (max-width: 900px) {
           .form-grid-3 { grid-template-columns: 1fr 1fr; }
           .preview-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
        
        @media (max-width: 768px) {
           .form-grid-3, .form-grid-2 { grid-template-columns: 1fr; gap: 1rem; }
           .design-grid { flex-direction: column; align-items: flex-start; gap: 1rem; }
           header h2 { font-size: 2.2rem !important; line-height: 1.2; }
        }
        
        .input-group {
          margin-bottom: 1.5rem;
        }
        .input-group label {
          display: block;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
        .input-group input,
        .input-group textarea,
        .input-group select {
          width: 100%;
          padding: 1rem;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          color: var(--text-primary);
          font-family: var(--font-ui);
          font-size: 1rem;
          transition: border-color 0.2s ease;
          border-radius: 4px;
        }
        .input-group input:focus,
        .input-group textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          background: var(--bg-color);
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
