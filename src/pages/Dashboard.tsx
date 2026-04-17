import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, PenTool, ArrowRight, Upload, Sparkles, Trash2 } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawingStore';
import { templates } from '@/lib/templates';

export default function Dashboard() {
  const { drawings, removeDrawing } = useDrawingStore();

  return (
    <div style={{ maxWidth: 780 }} className="animate-fade-in">
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <p className="font-meta" style={{ marginBottom: 10 }}>Engineering Platform</p>
        <h1 className="font-headline" style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: 'var(--text)', marginBottom: 12 }}>
          DrawSpec
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 520 }}>
          Technical drawings from text specifications. Upload files, generate from descriptions, edit with AI — no AutoCAD required.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 48 }}>
        <Link to="/editor" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '22px 20px', borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
            color: 'white', display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 4px 16px rgba(99,91,255,0.25)',
            transition: 'all 0.2s', cursor: 'pointer',
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <Plus size={20} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>New Drawing</p>
              <p style={{ fontSize: 12, opacity: 0.8 }}>Text, upload, or template</p>
            </div>
          </div>
        </Link>

        <Link to="/editor/demo-fst" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '22px 20px', textDecoration: 'none' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PenTool size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Demo: FST</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>25m settlement tank</p>
          </div>
          <ArrowRight size={14} style={{ color: 'var(--text-3)' }} />
        </Link>

        <Link to="/templates" className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '22px 20px', textDecoration: 'none' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} style={{ color: 'var(--text-2)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Templates</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{templates.length} engineering templates</p>
          </div>
          <ArrowRight size={14} style={{ color: 'var(--text-3)' }} />
        </Link>
      </div>

      {/* Recent Drawings */}
      <div className="ruled" style={{ marginBottom: 48 }}>
        <p className="font-meta" style={{ marginBottom: 18 }}>Recent Drawings</p>
        {drawings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--bg)' }}>
            <FileText size={28} style={{ color: 'var(--text-3)', margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No drawings yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {drawings.map((d) => (
              <Link key={d.id} to={`/editor/${d.id}`} className="card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={15} style={{ color: 'var(--text-3)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>{d.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                      {d.spec.views.length} view{d.spec.views.length !== 1 ? 's' : ''} · {d.spec.titleBlock.drawingNo} · Rev {d.spec.titleBlock.revision}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-3)' }}>
                    <Clock size={11} />
                    {new Date(d.updatedAt).toLocaleDateString()}
                  </span>
                  {d.id !== 'demo-fst' && (
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (confirm(`Delete "${d.name}"?`)) removeDrawing(d.id); }}
                      style={{ padding: 4, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-3)', borderRadius: 4 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Capabilities */}
      <div className="ruled">
        <p className="font-meta" style={{ marginBottom: 18 }}>Capabilities</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {[
            { icon: '✏️', title: 'Text to Drawing', desc: 'Describe in plain English, get a technical drawing' },
            { icon: '📁', title: 'File Import', desc: 'DXF, DWG, PDF, SVG, PNG, JPG' },
            { icon: '💬', title: 'Chat Editing', desc: 'Modify drawings via natural language' },
            { icon: '📐', title: 'Dimensions Panel', desc: 'Edit dims, offsets, and title block directly' },
            { icon: '🔄', title: 'SVG Export', desc: 'Export production-ready vector drawings' },
            { icon: '🌙', title: 'Dark Mode', desc: 'Comfortable viewing in any lighting' },
          ].map((f) => (
            <div key={f.title} style={{
              padding: '16px 18px', borderRadius: 'var(--radius-md)',
              background: 'var(--bg)', border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginTop: 8, letterSpacing: '-0.01em' }}>{f.title}</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
