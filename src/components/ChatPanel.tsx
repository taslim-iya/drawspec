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
      content: `Editing "${drawingName}". Describe changes in plain English — I'll update the drawing.\n\nExamples:\n• "Make the walls 300mm thick"\n• "Add a second outlet on the north side"\n• "Change the floor slope to 10°"\n• "Add a label for the scraper mechanism"`,
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
      const res = await fetch('/api/chat-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          currentSpec: spec,
          history: messages.filter((m) => m.role !== 'system').slice(-6),
        }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { id: `msg-${Date.now()}`, role: 'assistant', content: `⚠️ ${data.error}`, timestamp: Date.now() },
        ]);
      } else if (data.updatedSpec) {
        onSpecUpdate(data.updatedSpec);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: data.explanation || 'Drawing updated.',
            timestamp: Date.now(),
          },
        ]);
      } else if (data.explanation) {
        setMessages((prev) => [
          ...prev,
          { id: `msg-${Date.now()}`, role: 'assistant', content: data.explanation, timestamp: Date.now() },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now()}`, role: 'assistant', content: '⚠️ Failed to process. Try again.', timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-500" />
          <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Edit by Chat</span>
        </div>
        <button onClick={() => setMessages((prev) => prev.filter((m) => m.role === 'system'))}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded" title="Clear chat">
          <Trash2 size={13} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`${msg.role === 'user' ? 'flex justify-end' : ''}`}>
            <div className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white'
                : msg.role === 'system'
                ? 'bg-gray-50 text-gray-500 border border-gray-100'
                : 'bg-gray-50 text-gray-800 border border-gray-100'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Loader2 size={12} className="animate-spin" />
            Updating drawing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-300">
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a change..."
            rows={1}
            className="flex-1 bg-transparent text-sm resize-none outline-none max-h-24 text-gray-900 placeholder-gray-400"
            style={{ minHeight: 24 }}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            className="p-1.5 text-indigo-600 hover:text-indigo-700 disabled:text-gray-300 transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
