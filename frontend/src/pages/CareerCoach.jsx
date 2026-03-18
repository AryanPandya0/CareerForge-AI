import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2 } from 'lucide-react';

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
                // Streaming complete — add the final message
                setMessages(prev => [...prev, { role: 'ai', content: fullText }]);
                setStreamingText('');
              }
            } catch (parseErr) {
              // skip malformed JSON chunks
            }
          }
        }
      }

      // Fallback: if stream ended without a done signal
      if (fullText && streamingText) {
        setMessages(prev => [...prev, { role: 'ai', content: fullText }]);
        setStreamingText('');
      }

    } catch (err) {
      console.error('Streaming error, falling back to regular endpoint:', err);
      // Fallback to non-streaming endpoint
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
      height: 'calc(100vh - 228px)', 
      display: 'flex', 
      flexDirection: 'column',
      padding: 0 
    }}>
      {/* Compact header */}
      <div style={{ 
        padding: '1.5rem 2rem', 
        borderBottom: '1px solid #eee',
        background: '#fff',
        flexShrink: 0
      }}>
        <h2 style={{ fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-editorial)' }}>
          🤖 AI Career Coach
        </h2>
      </div>

      {/* Chat messages — takes all available space */}
      <div 
        ref={scrollRef} 
        style={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          padding: '1.5rem 2rem',
          background: '#fafafa'
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            justifyContent: msg.role === 'human' ? 'flex-end' : 'flex-start', 
            marginBottom: '1.2rem' 
          }}>
            <div style={{ 
              maxWidth: '75%', 
              padding: '1rem 1.4rem',
              background: msg.role === 'human' ? '#1a1a1a' : '#fff',
              color: msg.role === 'human' ? '#fff' : '#333',
              borderRadius: msg.role === 'human' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              boxShadow: msg.role === 'ai' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              border: msg.role === 'ai' ? '1px solid #eee' : 'none'
            }}>
              {msg.role === 'ai' ? (
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Streaming text (typing effect) */}
        {streamingText && (
          <div style={{ display: 'flex', marginBottom: '1.2rem' }}>
            <div style={{ 
              maxWidth: '75%', 
              padding: '1rem 1.4rem',
              background: '#fff',
              color: '#333',
              borderRadius: '18px 18px 18px 4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #eee'
            }}>
              <div className="markdown-content">
                <ReactMarkdown>{streamingText}</ReactMarkdown>
              </div>
              <span className="typing-cursor">|</span>
            </div>
          </div>
        )}

        {/* Loading indicator (before streaming starts) */}
        {loading && !streamingText && (
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '1rem 1.4rem', 
              background: '#fff', 
              borderRadius: '18px 18px 18px 4px',
              border: '1px solid #eee'
            }}>
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area — fixed at bottom */}
      <form onSubmit={handleSend} style={{ 
        padding: '1rem 2rem', 
        background: '#fff', 
        borderTop: '1px solid #eee', 
        display: 'flex', 
        gap: '1rem',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about interviews, tech concepts, career roadmaps..." 
          style={{ 
            flexGrow: 1, background: '#f5f5f5', border: '1px solid #e5e5e5', 
            fontSize: '1rem', padding: '0.9rem 1.2rem', borderRadius: '24px',
            outline: 'none', fontFamily: 'var(--font-ui)',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#999'}
          onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || loading} 
          style={{ 
            background: input.trim() ? '#1a1a1a' : '#e5e5e5', 
            border: 'none', cursor: input.trim() ? 'pointer' : 'default', 
            padding: '0.8rem',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
            width: '44px', height: '44px'
          }}
        >
          <Send size={18} color={input.trim() ? '#fff' : '#999'} />
        </button>
      </form>

      <style>{`
        .markdown-content {
          font-size: 0.95rem;
          line-height: 1.7;
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
        }
        .markdown-content code {
          background: #f0f0f0;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
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
        }
        .markdown-content pre code {
          background: none;
          padding: 0;
          color: inherit;
          font-size: 0.85rem;
        }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          margin: 0.8rem 0 0.4rem 0;
          font-family: var(--font-editorial);
        }
        .markdown-content h3 { font-size: 1.1rem; }
        .markdown-content h2 { font-size: 1.2rem; }
        .markdown-content blockquote {
          border-left: 3px solid #ddd;
          padding-left: 1rem;
          margin: 0.5rem 0;
          color: #666;
        }

        .typing-cursor {
          display: inline-block;
          animation: blink 0.7s step-end infinite;
          color: #999;
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
          background: #ccc;
          border-radius: 50%;
          animation: dotPulse 1.4s ease-in-out infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* scrollbar */
        .coach-page div::-webkit-scrollbar {
          width: 6px;
        }
        .coach-page div::-webkit-scrollbar-track {
          background: transparent;
        }
        .coach-page div::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default CareerCoach;
