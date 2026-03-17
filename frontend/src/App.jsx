import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Download, Bot, Target, FileText } from 'lucide-react';
import Home from './pages/Home';
import ResumeBuilder from './pages/ResumeBuilder';
import ATSScanner from './pages/ATSScanner';
import CareerCoach from './pages/CareerCoach';
import './App.css';

const Layout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <Link to="/" className="logo">CAREERFORGE</Link>
          <div className="nav-links">
            <Link to="/builder" className={`nav-link ${location.pathname === '/builder' ? 'active' : ''}`}>Builder</Link>
            <Link to="/scanner" className={`nav-link ${location.pathname === '/scanner' ? 'active' : ''}`}>Scanner</Link>
            <Link to="/coach" className={`nav-link ${location.pathname === '/coach' ? 'active' : ''}`}>Coach</Link>
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2025 CAREERFORGE AI. HANDCRAFTED FOR YOUR CAREER.</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
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
  );
}

export default App;
