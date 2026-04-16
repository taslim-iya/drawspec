import { useState } from 'react';
import { Key, Save, Check, Info, Trash2, Database } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawingStore';

export default function Settings() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('drawspec-openai-key') || '');
  const [saved, setSaved] = useState(false);
  const { drawings } = useDrawingStore();

  const save = () => {
    localStorage.setItem('drawspec-openai-key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearStorage = () => {
    if (confirm('Clear all drawings and settings? This cannot be undone.')) {
      localStorage.removeItem('drawspec-store');
      localStorage.removeItem('drawspec-openai-key');
      window.location.reload();
    }
  };

  return (
    <div style={{ maxWidth: 560 }} className="animate-fade-in">
      <div style={{ marginBottom: 40 }}>
        <p className="font-meta" style={{ marginBottom: 10 }}>Configuration</p>
        <h1 className="font-headline" style={{ fontSize: 32, color: 'var(--text)', marginBottom: 8 }}>Settings</h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
          Configure API keys and manage your DrawSpec data.
        </p>
      </div>

      {/* API Key */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--accent-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Key size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>OpenAI API Key</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Required for AI text-to-drawing and chat editing</p>
          </div>
        </div>
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-proj-..."
          className="input-premium" style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 12 }} />
        <button onClick={save} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Key</>}
        </button>
      </div>

      {/* Data */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--surface-2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Database size={16} style={{ color: 'var(--text-2)' }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Local Storage</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{drawings.length} drawing{drawings.length !== 1 ? 's' : ''} stored locally</p>
          </div>
        </div>
        <button onClick={clearStorage} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)' }}>
          <Trash2 size={14} /> Clear All Data
        </button>
      </div>

      {/* About */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--surface-2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Info size={16} style={{ color: 'var(--text-2)' }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>About DrawSpec</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>v0.1.0</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
          DrawSpec generates engineering technical drawings from natural language specifications.
          Designed to replace the back-and-forth between designers and BIM/CAD teams.
        </p>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          {[
            { label: 'Text → Drawing', desc: 'AI generation' },
            { label: 'Chat Editing', desc: 'Modify via NL' },
            { label: 'DXF Import', desc: 'AutoCAD files' },
            { label: 'SVG Export', desc: 'Vector output' },
          ].map((f) => (
            <div key={f.label} style={{
              flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-2)', textAlign: 'center',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{f.label}</p>
              <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
