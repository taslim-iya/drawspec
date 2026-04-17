import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Trash2 } from 'lucide-react';
import type { DrawingSpec } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface Props {
  spec: DrawingSpec;
  onSpecUpdate: (newSpec: DrawingSpec) => void;
  drawingName: string;
}

export default function ChatPanel({ spec, onSpecUpdate, drawingName }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: `Editing "${drawingName}".\n\nDescribe changes:\n• "Make walls 300mm"\n• "Add outlet on north side"\n• "Change slope to 10°"\n• "Add label for scraper"`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: `msg-${Date.now()}`, role: 'user', content: input.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const localKey = localStorage.getItem('drawspec-openai-key') || '';
      const res = await fetch('/api/chat-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          currentSpec: spec,
          history: messages.filter((m) => m.role !== 'system').slice(-6),
          apiKey: localKey,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, role: 'assistant', content: data.error, timestamp: Date.now() }]);
      } else if (data.updatedSpec) {
        onSpecUpdate(data.updatedSpec);
        setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, role: 'assistant', content: data.explanation || 'Drawing updated.', timestamp: Date.now() }]);
      } else if (data.explanation) {
        setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, role: 'assistant', content: data.explanation, timestamp: Date.now() }]);
      }
    } catch {
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, role: 'assistant', content: 'Failed to process. Try again.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="panel-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={12} style={{ color: 'var(--accent)' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>AI Editor</span>
        </div>
        <button onClick={() => setMessages((prev) => prev.filter((m) => m.role === 'system'))}
          className="btn-ghost" style={{ padding: 4, color: 'var(--text-3)' }}><Trash2 size={13} /></button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '88%', borderRadius: 12, padding: '10px 14px',
                fontSize: 13, lineHeight: 1.6, letterSpacing: '-0.01em',
                ...(msg.role === 'user' ? {
                  background: 'var(--accent)', color: 'white',
                  borderBottomRightRadius: 4,
                  boxShadow: '0 1px 4px rgba(99,91,255,0.2)',
                } : msg.role === 'system' ? {
                  background: 'var(--surface-2)', color: 'var(--text-3)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: 12,
                } : {
                  background: 'var(--surface-2)', color: 'var(--text)',
                  border: '1px solid var(--border-subtle)',
                  borderBottomLeftRadius: 4,
                }),
              }}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
              <div className="animate-pulse" style={{ display: 'flex', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', opacity: 0.6 }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', opacity: 0.4 }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', opacity: 0.2 }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Updating drawing...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          background: 'var(--bg-alt)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '10px 12px',
          transition: 'all 0.2s',
        }}>
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Describe a change..."
            rows={1}
            style={{
              flex: 1, background: 'transparent', fontSize: 13, resize: 'none', outline: 'none',
              maxHeight: 96, minHeight: 24, color: 'var(--text)', border: 'none',
              fontFamily: 'var(--font-body)',
            }}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: input.trim() ? 'var(--accent)' : 'var(--surface-hover)',
              color: input.trim() ? 'white' : 'var(--text-3)',
              transition: 'all 0.15s',
              opacity: loading ? 0.5 : 1,
            }}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
