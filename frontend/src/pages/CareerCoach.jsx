import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2 } from 'lucide-react';
// Do not import useTheme as it's not strictly necessary for component function but good if we needed state

const API_URL = 'http://localhost:8000';

const CareerCoach = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hey! 👋 I'm **CareerForge AI**, your personal career coach.\n\nI can help you with:\n- 🎤 **Interview Prep** (Mock questions, STAR method)\n- 💻 **Tech Concepts** (Python, AI, DSA explained simply)\n- 🗺️ **Career Roadmaps** for students & professionals\n\nWhat would you like to work on today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleSend = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMessage = { role: 'human', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setStreamingText('');

    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          history: updatedMessages
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                fullText += data.chunk;
                setStreamingText(fullText);
              }
              if (data.done) {
                setMessages(prev => [...prev, { role: 'ai', content: fullText }]);
                setStreamingText('');
              }
            } catch (parseErr) {
              // skip
            }
          }
        }
      }

      if (fullText && streamingText) {
        setMessages(prev => [...prev, { role: 'ai', content: fullText }]);
        setStreamingText('');
      }

    } catch (err) {
      console.error('Streaming error, falling back to regular endpoint:', err);
      try {
        const response = await fetch(`${API_URL}/chat/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, history: updatedMessages })
        });
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
      } catch (fallbackErr) {
        setMessages(prev => [...prev, { role: 'ai', content: '⚠️ Connection error. Please try again.' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coach-page" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      padding: 0,
      flexGrow: 1,
      minHeight: 'calc(100dvh - 140px)' // desktop fallback
    }}>
      {/* Compact header */}
      <div style={{ 
        padding: '1.2rem 1.5rem', 
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--card-bg)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        zIndex: 10
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '1.2rem'
        }}>
          🤖
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--text-primary)' }}>
            CareerForge AI
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 500 }}>● Online Coach</span>
        </div>
      </div>

      {/* Chat messages */}
      <div 
        ref={scrollRef} 
        style={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          padding: '1.5rem',
          background: 'var(--bg-color)'
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            justifyContent: msg.role === 'human' ? 'flex-end' : 'flex-start', 
            marginBottom: '1rem' 
          }}>
            <div style={{ 
              maxWidth: '85%', 
              padding: '0.8rem 1.2rem',
              background: msg.role === 'human' ? 'var(--primary-color)' : 'var(--card-bg)',
              color: msg.role === 'human' ? '#fff' : 'var(--text-primary)',
              borderRadius: msg.role === 'human' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              border: msg.role === 'ai' ? '1px solid var(--border-color)' : 'none'
            }}>
              {msg.role === 'ai' ? (
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {streamingText && (
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <div style={{ 
              maxWidth: '85%', 
              padding: '0.8rem 1.2rem',
              background: 'var(--card-bg)',
              color: 'var(--text-primary)',
              borderRadius: '18px 18px 18px 4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              border: '1px solid var(--border-color)'
            }}>
              <div className="markdown-content">
                <ReactMarkdown>{streamingText}</ReactMarkdown>
              </div>
              <span className="typing-cursor">|</span>
            </div>
          </div>
        )}

        {loading && !streamingText && (
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '1rem 1.4rem', 
              background: 'var(--card-bg)', 
              borderRadius: '18px 18px 18px 4px',
              border: '1px solid var(--border-color)'
            }}>
              <div className="typing-dots">
                <span style={{background: 'var(--primary-color)'}}></span>
                <span style={{background: 'var(--primary-color)'}}></span>
                <span style={{background: 'var(--primary-color)'}}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} style={{ 
        padding: '1rem', 
        background: 'var(--card-bg)', 
        borderTop: '1px solid var(--border-color)', 
        display: 'flex', 
        gap: '0.8rem',
        alignItems: 'center',
        flexShrink: 0,
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about interviews..." 
          style={{ 
            flexGrow: 1, background: 'var(--bg-color)', border: '1px solid var(--border-color)', 
            color: 'var(--text-primary)',
            fontSize: '1rem', padding: '0.8rem 1.2rem', borderRadius: '24px',
            outline: 'none', fontFamily: 'var(--font-ui)',
            transition: 'border-color 0.2s',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || loading} 
          style={{ 
            background: input.trim() ? 'var(--primary-color)' : 'var(--bg-color)', 
            border: input.trim() ? 'none' : '1px solid var(--border-color)',
            cursor: input.trim() ? 'pointer' : 'default', 
            padding: '0.8rem',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
            width: '46px', height: '46px',
            color: input.trim() ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Send size={20} />
        </button>
      </form>

      <style>{`
        /* Global override for coach page body */
        body {
          overscroll-behavior-y: contain;
        }
        
        @media (max-width: 768px) {
           .coach-page {
               height: calc(100dvh - 66px) !important; /* bottom nav height applied */
           }
        }

        .markdown-content {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-primary);
        }
        .markdown-content p {
          margin: 0 0 0.6rem 0;
        }
        .markdown-content p:last-child {
          margin-bottom: 0;
        }
        .markdown-content ul, .markdown-content ol {
          margin: 0.4rem 0 0.6rem 0;
          padding-left: 1.5rem;
        }
        .markdown-content li {
          margin-bottom: 0.3rem;
        }
        .markdown-content strong {
          font-weight: 600;
          color: inherit;
        }
        .markdown-content code {
          background: rgba(128, 128, 128, 0.15);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.85em;
          font-family: 'Consolas', 'Monaco', monospace;
        }
        .markdown-content pre {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 0.6rem 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .markdown-content pre code {
          background: none;
          padding: 0;
          color: inherit;
          font-size: 0.85rem;
        }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          margin: 0.8rem 0 0.4rem 0;
          font-family: var(--font-ui);
          font-weight: 600;
        }
        .markdown-content h3 { font-size: 1.05rem; }
        .markdown-content h2 { font-size: 1.15rem; }
        .markdown-content blockquote {
          border-left: 3px solid var(--primary-color);
          padding-left: 1rem;
          margin: 0.5rem 0;
          color: var(--text-secondary);
          background: rgba(36, 88, 60, 0.05); /* very light green */
          border-radius: 0 4px 4px 0;
        }
        
        [data-theme='dark'] .markdown-content blockquote {
          background: rgba(36, 88, 60, 0.2);
        }

        .typing-cursor {
          display: inline-block;
          animation: blink 0.7s step-end infinite;
          color: var(--text-secondary);
          font-weight: 300;
          margin-left: 2px;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          height: 20px;
        }
        .typing-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: dotPulse 1.4s ease-in-out infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* custom scrollbar for messages */
        .coach-page div::-webkit-scrollbar {
          width: 6px;
        }
        .coach-page div::-webkit-scrollbar-track {
          background: transparent;
        }
        .coach-page div::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
        .coach-page div::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default CareerCoach;
