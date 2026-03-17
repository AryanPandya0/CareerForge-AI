import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Loader2, TrendingUp, AlertCircle, CheckCircle2, Upload, FileText, Sparkles } from 'lucide-react';

const ATSScanner = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [inputMethod, setInputMethod] = useState('upload'); // 'upload' or 'paste'
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const savedResume = sessionStorage.getItem('resume_text');
    if (savedResume && !resumeText && inputMethod === 'paste') {
      setResumeText(savedResume);
    }
  }, [inputMethod]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExtracting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/extract-pdf', formData);
      if (response.data.text) {
        setResumeText(response.data.text);
        alert('PDF Loaded Successfully!');
      } else {
        alert('Error reading PDF: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to extract text from PDF.');
    } finally {
      setExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription || !resumeText) {
      alert('Please provide both a Job Description and Resume text.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/ats/analyze', {
        resume_text: resumeText,
        job_description: jobDescription
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-page container" style={{ padding: '4rem 0' }}>
      <header style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>ATS Intelligence</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
          Check if your resume is ready for the real world. Quantify your match and discover technical gaps.
        </p>
      </header>

      <div className="scanner-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem' }}>
        <div className="input-section">
          <div className="input-group">
            <label>1. Target Specification (Job Description)</label>
            <textarea 
              value={jobDescription} 
              onChange={(e) => setJobDescription(e.target.value)} 
              placeholder="e.g. We are looking for a Python Developer with 2 years of experience..."
              style={{ height: '150px' }}
            />
          </div>

          <div className="input-group" style={{ marginTop: '2.5rem' }}>
            <label>2. Your Resume</label>
            <div className="method-selector" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <button 
                className={`btn-secondary ${inputMethod === 'upload' ? 'active-method' : ''}`} 
                onClick={() => setInputMethod('upload')}
                style={{ flex: 1, padding: '0.8rem', fontSize: '0.8rem', borderColor: inputMethod === 'upload' ? 'black' : '#eee' }}
              >
                UPLOAD PDF
              </button>
              <button 
                className={`btn-secondary ${inputMethod === 'paste' ? 'active-method' : ''}`} 
                onClick={() => setInputMethod('paste')}
                style={{ flex: 1, padding: '0.8rem', fontSize: '0.8rem', borderColor: inputMethod === 'paste' ? 'black' : '#eee' }}
              >
                PASTE / IMPORT
              </button>
            </div>

            {inputMethod === 'upload' ? (
              <div className="upload-box glass" style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #ccc' }}>
                <input type="file" accept=".pdf" onChange={handleFileUpload} id="pdf-upload" style={{ display: 'none' }} />
                <label htmlFor="pdf-upload" style={{ cursor: 'pointer' }}>
                  {extracting ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : <Upload style={{ margin: '0 auto 1rem' }} />}
                  <p style={{ fontSize: '0.9rem' }}>{extracting ? 'Extracting text...' : 'Click to upload your existing Resume (PDF)'}</p>
                </label>
              </div>
            ) : (
              <textarea 
                value={resumeText} 
                onChange={(e) => setResumeText(e.target.value)} 
                placeholder="Paste your resume content here..."
                style={{ height: '300px' }}
              />
            )}
          </div>

          <button className="btn-primary" onClick={handleAnalyze} disabled={loading} style={{ width: '100%', marginTop: '2rem' }}>
            {loading ? <Loader2 className="animate-spin" /> : '🚀 ANALYZE RESUME'}
          </button>
        </div>

        <div className="result-section">
          {!analysis && (
            <div className="glass" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', padding: '4rem', textAlign: 'center' }}>
              <p>Execute analytics to generate your professional readiness report.</p>
            </div>
          )}

          {analysis && (
            <div className="analysis-report animate-fade-in">
              <div className={`verdict-banner ${analysis.is_hirable ? 'hired' : 'not-selected'}`} style={{ 
                padding: '2rem', 
                marginBottom: '2rem', 
                background: analysis.is_hirable ? '#e8f5e9' : '#ffebee',
                borderLeft: `5px solid ${analysis.is_hirable ? '#2e7d32' : '#c62828'}`
              }}>
                <h3 style={{ fontSize: '1.5rem', color: analysis.is_hirable ? '#1b5e20' : '#b71c1c', marginBottom: '0.5rem', fontFamily: 'var(--font-editorial)' }}>
                  {analysis.is_hirable ? '✅ YOU ARE HIRED!' : '⚠️ NOT SELECTED'}
                </h3>
                <p style={{ fontSize: '0.9rem', color: analysis.is_hirable ? '#2e7d32' : '#c62828' }}>
                  {analysis.is_hirable 
                    ? `Based on your profile, you are a strong match for the ${analysis.recommended_role} position.` 
                    : `Currently, your profile does not meet the requirements for this role. You need to upskill.`}
                </p>
              </div>

              <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: analysis.is_hirable ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="metric-card">
                  <label>ATS SCORE</label>
                  <p>{analysis.ats_score}%</p>
                </div>
                <div className="metric-card">
                  <label>ROLE</label>
                  <p>{analysis.recommended_role}</p>
                </div>
                <div className="metric-card">
                  <label>READINESS</label>
                  <p>{analysis.placement_readiness}</p>
                </div>
                {analysis.is_hirable && (
                  <div className="metric-card highlight">
                    <label>✨ EST. SALARY</label>
                    <p>{analysis.salary_estimation}</p>
                  </div>
                )}
              </div>

              <div className="editorial-divider" style={{ opacity: 0.1 }}></div>

              <div className="insights-section">
                <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: '#888', marginBottom: '1.5rem' }}>🚨 CRITICAL MISSING SKILLS</h4>
                {analysis.missing_keywords && analysis.missing_keywords.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '3rem' }}>
                    {analysis.missing_keywords.map((kw, i) => (
                      <span key={i} style={{ background: '#fff1f1', color: '#d32f2f', padding: '0.5rem 1rem', fontSize: '0.8rem', border: '1px solid #ffdde0' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#2e7d32', marginBottom: '3rem', fontSize: '0.9rem' }}>✅ All keywords matched!</p>
                )}

                <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: '#888', marginBottom: '1.5rem' }}>💡 IMPROVEMENT PLAN</h4>
                <ul className="improvement-list" style={{ listStyle: 'none', padding: 0 }}>
                  {analysis.improvement_tips.map((tip, i) => (
                    <li key={i} style={{ marginBottom: '1.2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <span style={{ color: '#1a237e', marginTop: '0.2rem' }}>•</span>
                      <span style={{ fontSize: '1rem', color: '#444', lineHeight: '1.6' }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .active-method {
          background: #000 !important;
          color: #fff !important;
        }
        .metric-card {
           padding: 1.5rem;
           background: #fcfcfc;
           border: 1px solid #efefef;
        }
        .metric-card label {
          display: block;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.5rem;
        }
        .metric-card p {
          font-size: 1.2rem;
          font-weight: 700;
          font-family: var(--font-editorial);
        }
        .metric-card.highlight {
          background: #f5f6ff;
          border-color: #e0e4ff;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
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
