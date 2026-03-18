import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const CareerCoach = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hey! I'm CareerForge AI, your personal career coach. Ask me about interview prep, tech concepts, or career roadmaps!" }
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
    const query = input.trim();
    if (!query || loading) return;

    const userMessage = { role: 'human', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/query`, {
        query: query,
        history: updatedMessages
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (err) {
      console.error('Error in chat:', err);
      const detail = err.response?.data?.detail || 'Connection interrupted. Please try again.';
      setMessages(prev => [...prev, { role: 'ai', content: `⚠️ ${detail}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coach-page container" style={{ padding: '4rem 0', height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🤖 AI Career Coach</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Interview prep, tech concepts, roadmaps. Ask anything career-related.
        </p>
      </header>

      <div className="chat-interface glass" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div ref={scrollRef} className="messages-container" style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              justifyContent: msg.role === 'human' ? 'flex-end' : 'flex-start', 
              marginBottom: '1.5rem' 
            }}>
              <div style={{ 
                maxWidth: '70%', 
                padding: '1rem 1.5rem',
                background: msg.role === 'human' ? '#1a1a1a' : '#f5f5f5',
                color: msg.role === 'human' ? '#fff' : '#333',
                borderRadius: msg.role === 'human' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
              }}>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              <div style={{ padding: '1rem 1.5rem', background: '#f5f5f5', borderRadius: '16px 16px 16px 4px' }}>
                <Loader2 size={16} className="animate-spin" style={{ color: '#aaa' }} />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} style={{ padding: '1.5rem 2rem', background: '#fcfcfc', borderTop: '1px solid #eee', display: 'flex', gap: '1rem' }}>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about interviews, tech concepts, career roadmaps..." 
            style={{ 
              flexGrow: 1, background: 'transparent', border: 'none', 
              fontSize: '1rem', outline: 'none', fontFamily: 'var(--font-ui)' 
            }}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading} 
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              opacity: input.trim() ? 1 : 0.3, padding: '0.5rem' 
            }}
          >
            <Send size={20} strokeWidth={1.5} />
          </button>
        </form>
      </div>

      <style>{`
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
          background: #ddd;
        }
      `}</style>
    </div>
  );
};

export default CareerCoach;
