import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Home as HomeIcon, FileText, Target, Bot } from 'lucide-react';
import Home from './pages/Home';
import ResumeBuilder from './pages/ResumeBuilder';
import ATSScanner from './pages/ATSScanner';
import CareerCoach from './pages/CareerCoach';
import './App.css';

// Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

const Layout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if we are on the coach page to apply specific layout rules
  const isCoachPage = location.pathname === '/coach';

  return (
    <div className={`app-container ${isCoachPage ? 'coach-active' : ''}`}>
      {/* Top Navigation (Desktop) - Hide on coach page for a more immersive experience on mobile if desired, or keep it. */}
      {(!isCoachPage || window.innerWidth > 768) && (
        <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
          <div className="container nav-content">
            <Link to="/" className="logo">CAREERFORGE</Link>
            <div className="nav-links">
              <Link to="/builder" className={`nav-link ${location.pathname === '/builder' ? 'active' : ''}`}>Builder</Link>
              <Link to="/scanner" className={`nav-link ${location.pathname === '/scanner' ? 'active' : ''}`}>Scanner</Link>
              <Link to="/coach" className={`nav-link ${location.pathname === '/coach' ? 'active' : ''}`}>Coach</Link>
              <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </nav>
      )}
      
      <main className={`main-content ${isCoachPage ? 'coach-main' : ''}`}>
        {children}
      </main>

      {/* Hide footer on coach page to maximize chat space */}
      {!isCoachPage && (
        <footer className="footer">
          <div className="container">
            <p>© 2025 CAREERFORGE AI. HANDCRAFTED FOR YOUR CAREER.</p>
          </div>
        </footer>
      )}

      {/* Bottom Navigation (Mobile) */}
      <nav className="bottom-nav">
        <div className="bottom-nav-content">
          <Link to="/" className={`bottom-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <HomeIcon size={24} />
            <span>Home</span>
          </Link>
          <Link to="/builder" className={`bottom-nav-link ${location.pathname === '/builder' ? 'active' : ''}`}>
            <FileText size={24} />
            <span>Builder</span>
          </Link>
          <Link to="/scanner" className={`bottom-nav-link ${location.pathname === '/scanner' ? 'active' : ''}`}>
            <Target size={24} />
            <span>Scanner</span>
          </Link>
          <Link to="/coach" className={`bottom-nav-link ${location.pathname === '/coach' ? 'active' : ''}`}>
            <Bot size={24} />
            <span>Coach</span>
          </Link>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)', gap: '0.25rem' }}>
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            <span style={{ fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>Theme</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<ResumeBuilder />} />
            <Route path="/scanner" element={<ATSScanner />} />
            <Route path="/coach" element={<CareerCoach />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
