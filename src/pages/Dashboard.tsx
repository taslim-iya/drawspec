import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, PenTool, Upload } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawingStore';
import { templates } from '@/lib/templates';

export default function Dashboard() {
  const { drawings } = useDrawingStore();

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <p className="font-meta" style={{ marginBottom: 8 }}>Engineering Platform</p>
        <h1 className="font-headline" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text)', marginBottom: 8, lineHeight: 1.1 }}>DrawSpec</h1>
        <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 500 }}>
          Engineering drawings from text specifications. Upload DXF files, generate from descriptions, edit with AI chat.
        </p>
      </div>

      {/* Actions */}
      <div className="ruled" style={{ marginBottom: 32 }}>
        <p className="font-meta" style={{ marginBottom: 16 }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <Link to="/editor" className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={18} color="white" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>New Drawing</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Text, upload, or template</p>
            </div>
          </Link>
          <Link to="/editor/demo-fst" className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PenTool size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Demo: FST</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)' }}>25m settlement tank</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent */}
      <div className="ruled">
        <p className="font-meta" style={{ marginBottom: 16 }}>Recent Drawings</p>
        {drawings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', border: '2px dashed var(--border)', borderRadius: 12 }}>
            <FileText size={28} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No drawings yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {drawings.map((d) => (
              <Link key={d.id} to={`/editor/${d.id}`} className="card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FileText size={16} style={{ color: 'var(--text-3)' }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{d.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{d.spec.views.length} view(s) · {d.spec.titleBlock.drawingNo}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-3)' }}>
                  <Clock size={11} />
                  {new Date(d.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="ruled" style={{ marginTop: 32 }}>
        <p className="font-meta" style={{ marginBottom: 16 }}>What Else Would Make This Useful</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { title: 'Real-time Collaboration', desc: 'Multiple engineers on the same drawing simultaneously' },
            { title: 'Version History', desc: 'Track every change with full revision control' },
            { title: 'PDF Export', desc: 'A3/A1 sheets with proper engineering borders' },
            { title: 'DXF Export', desc: 'Export back to AutoCAD-compatible format' },
            { title: 'Component Library', desc: 'Drag standard components (valves, pumps, fittings)' },
            { title: 'Measurement Tools', desc: 'Click-to-measure distances and angles on drawings' },
            { title: 'Annotation Mode', desc: 'Markup and comment on drawings for review' },
            { title: 'Calculation Sheets', desc: 'Linked design calculations (flow rates, loads)' },
          ].map((f) => (
            <div key={f.title} style={{ padding: '12px 16px', border: '1px solid var(--border-light)', borderRadius: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{f.title}</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
