import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const CareerCoach = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Welcome to your editorial consultation. I am your CareerForge partner. How may I assist in architecting your professional path today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'human', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat/query', {
        query: input,
        history: messages
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, { role: 'ai', content: "I apologize, but my connection to the architect core has been interrupted. Please try again shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coach-page container" style={{ padding: '4rem 0', height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Editorial Coach</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Dialogue with intelligence. Refine your roadmap and interview presence.</p>
      </header>

      <div className="chat-interface glass" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0' }}>
        <div ref={scrollRef} className="messages-container" style={{ flexGrow: 1, overflowY: 'auto', padding: '3rem' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`message-wrapper ${msg.role}`} style={{ display: 'flex', justifyContent: msg.role === 'human' ? 'flex-end' : 'flex-start', marginBottom: '2.5rem' }}>
              <div className="message-content" style={{ maxWidth: '70%', textAlign: msg.role === 'human' ? 'right' : 'left' }}>
                <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#aaa', display: 'block', marginBottom: '0.8rem' }}>
                  {msg.role === 'human' ? 'CANDIDATE' : 'ARCHITECT'}
                </label>
                <p style={{ fontSize: '1.05rem', color: msg.role === 'human' ? '#000' : '#444', lineHeight: '1.7', fontWeight: msg.role === 'human' ? 500 : 300 }}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-wrapper ai" style={{ display: 'flex', marginBottom: '2rem' }}>
              <div className="message-content">
                <Loader2 size={16} className="animate-spin" style={{ color: '#aaa' }} />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="input-area" style={{ padding: '2rem 3rem', background: '#fcfcfc', borderTop: '1px solid #eee' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the architect..." 
              style={{ flexGrow: 1, background: 'transparent', border: 'none', fontSize: '1.1rem', outline: 'none', fontFamily: 'var(--font-ui)' }}
            />
            <button type="submit" disabled={!input.trim() || loading} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: input.trim() ? 1 : 0.3 }}>
              <Send size={20} strokeWidth={1.5} />
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .messages-container::-webkit-scrollbar {
          width: 4px;
        }
        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .messages-container::-webkit-scrollbar-thumb {
          background: #eee;
        }
      `}</style>
    </div>
  );
};

export default CareerCoach;
