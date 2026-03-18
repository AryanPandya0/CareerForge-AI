import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Upload } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const ATSScanner = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [inputMethod, setInputMethod] = useState('paste');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedResume = sessionStorage.getItem('resume_text');
    if (savedResume) {
      setResumeText(savedResume);
      setInputMethod('paste');
    }
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExtracting(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/extract-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.text) {
        setResumeText(response.data.text);
      } else if (response.data.error) {
        setError('Error reading PDF: ' + response.data.error);
      }
    } catch (err) {
      console.error('Error uploading PDF:', err);
      setError('Failed to extract text from PDF.');
    } finally {
      setExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    setError('');
    if (!jobDescription) {
      setError('⚠️ Please paste a Job Description first.');
      return;
    }
    if (!resumeText) {
      setError('⚠️ Please provide a resume (Upload or Paste).');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/ats/analyze`, {
        resume_text: resumeText,
        job_description: jobDescription
      });
      setAnalysis(response.data);
    } catch (err) {
      console.error('Error analyzing resume:', err);
      const detail = err.response?.data?.detail || 'Analysis failed. Please try again.';
      setError(`❌ ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-page container" style={{ padding: '4rem 0' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📊 ATS Resume Score & Salary Predictor</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
          Check if your resume is ready for the real world.
        </p>
      </header>

      {error && (
        <div style={{ padding: '1rem 1.5rem', background: '#f8d7da', border: '1px solid #f5c6cb', marginBottom: '2rem', color: '#721c24' }}>
          {error}
        </div>
      )}

      <div className="scanner-layout">
        {/* Left: Inputs */}
        <div>
          <div className="input-group">
            <label>1. Target Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. We are looking for a Python Developer with 2 years of experience..."
              style={{ height: '150px' }}
            />
          </div>

          <div className="input-group" style={{ marginTop: '2rem' }}>
            <label>2. Your Resume</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setInputMethod('upload')}
                style={{
                  flex: 1, padding: '0.8rem', fontSize: '0.8rem', cursor: 'pointer',
                  background: inputMethod === 'upload' ? 'var(--primary-color)' : 'var(--card-bg)',
                  color: inputMethod === 'upload' ? '#fff' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)', fontFamily: 'var(--font-ui)', letterSpacing: '0.05em'
                }}
              >
                UPLOAD PDF
              </button>
              <button
                type="button"
                onClick={() => setInputMethod('paste')}
                style={{
                  flex: 1, padding: '0.8rem', fontSize: '0.8rem', cursor: 'pointer',
                  background: inputMethod === 'paste' ? 'var(--primary-color)' : 'var(--card-bg)',
                  color: inputMethod === 'paste' ? '#fff' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)', fontFamily: 'var(--font-ui)', letterSpacing: '0.05em'
                }}
              >
                IMPORT TEXT
              </button>
            </div>

            {inputMethod === 'upload' ? (
              <div style={{ padding: '2rem', textAlign: 'center', border: '2px dashed var(--border-color)', background: 'var(--card-bg)', borderRadius: '4px' }}>
                <input type="file" accept=".pdf" onChange={handleFileUpload} id="pdf-upload" style={{ display: 'none' }} />
                <label htmlFor="pdf-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  {extracting ? (
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: 'var(--primary-color)' }} />
                  ) : (
                    <Upload size={24} style={{ margin: '0 auto 0.5rem', display: 'block', color: 'var(--primary-color)' }} />
                  )}
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {extracting ? 'Extracting text...' : 'Upload your existing Resume (PDF)'}
                  </p>
                </label>
                {resumeText && inputMethod === 'upload' && (
                  <p style={{ marginTop: '1rem', color: 'var(--primary-color)', fontSize: '0.85rem' }}>✅ PDF Loaded Successfully!</p>
                )}
              </div>
            ) : (
              <div>
                {sessionStorage.getItem('resume_text') && (
                  <p style={{ padding: '0.8rem', background: 'rgba(36, 88, 60, 0.1)', border: '1px solid var(--border-color)', color: 'var(--primary-color)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    💡 Found content from the Resume Builder! Pre-filled below.
                  </p>
                )}
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  style={{ height: '300px' }}
                />
              </div>
            )}
          </div>

          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</> : '🚀 Analyze Resume'}
          </button>
        </div>

        {/* Right: Results */}
        <div>
          {!analysis && !loading && (
            <div className="glass" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', padding: '4rem', textAlign: 'center' }}>
              <p>Submit your resume and job description to see your analysis report.</p>
            </div>
          )}

          {analysis && (
            <div className="analysis-report" style={{ animation: 'fadeIn 0.5s ease-out' }}>
              {/* Verdict Banner */}
              <div style={{
                padding: '1.5rem 2rem',
                marginBottom: '2rem',
                background: analysis.is_hirable ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                border: `1px solid ${analysis.is_hirable ? '#28a745' : '#dc3545'}`,
                color: 'var(--text-primary)',
                borderRadius: '4px'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontFamily: 'var(--font-editorial)', color: analysis.is_hirable ? '#28a745' : '#dc3545' }}>
                  🎯 Final Verdict
                </h3>
                <p style={{ fontSize: '1rem' }}>
                  {analysis.is_hirable
                    ? `✅ YOU ARE HIRED! Based on your profile, you are a strong match for the ${analysis.recommended_role} position.`
                    : `⚠️ NOT SELECTED. Currently, your profile does not meet the requirements. You need to upskill.`}
                </p>
              </div>

              {/* Metrics */}
              <div className="metrics-grid">
                <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', textAlign: 'center', borderRadius: '4px' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>ATS SCORE</p>
                  <p style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-editorial)', color: 'var(--primary-color)' }}>{analysis.ats_score}%</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', textAlign: 'center', borderRadius: '4px' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>ROLE</p>
                  <p style={{ fontSize: '1rem', fontWeight: 600 }}>{analysis.recommended_role}</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', textAlign: 'center', borderRadius: '4px' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>READINESS</p>
                  <p style={{ fontSize: '1rem', fontWeight: 600 }}>{analysis.placement_readiness}</p>
                </div>
                {analysis.is_hirable && (
                  <div style={{ padding: '1.5rem', background: 'rgba(36, 88, 60, 0.05)', border: '1px solid var(--primary-color)', textAlign: 'center', borderRadius: '4px' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>✨ EST. SALARY</p>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)' }}>{analysis.salary_estimation}</p>
                  </div>
                )}
              </div>

              {/* Missing Skills */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>🚨 Critical Missing Skills</h4>
                {analysis.missing_keywords && analysis.missing_keywords.length > 0 ? (
                  <div style={{ padding: '1rem', background: 'rgba(220, 53, 69, 0.1)', border: '1px solid #dc3545', color: 'var(--text-primary)', borderRadius: '4px' }}>
                    Missing: <strong style={{color: '#dc3545'}}>{analysis.missing_keywords.join(', ')}</strong>
                  </div>
                ) : (
                  <div style={{ padding: '1rem', background: 'rgba(40, 167, 69, 0.1)', border: '1px solid #28a745', color: 'var(--text-primary)', borderRadius: '4px' }}>
                    ✅ All keywords matched!
                  </div>
                )}
              </div>

              {/* Improvement Tips */}
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>💡 Improvement Plan</h4>
                {analysis.improvement_tips.map((tip, i) => (
                  <div key={i} style={{ padding: '0.8rem 1rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.95rem', borderRadius: '4px' }}>
                    • {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .scanner-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        @media (max-width: 900px) {
           .metrics-grid {
             grid-template-columns: repeat(2, 1fr);
           }
        }
        @media (max-width: 768px) {
           .scanner-layout {
              grid-template-columns: 1fr;
              gap: 2rem;
           }
        }
        .input-group label {
          display: block;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
        .input-group textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          color: var(--text-primary);
          font-family: var(--font-ui);
          font-size: 1rem;
          transition: border-color 0.2s ease;
          resize: vertical;
          border-radius: 4px;
        }
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ATSScanner;
