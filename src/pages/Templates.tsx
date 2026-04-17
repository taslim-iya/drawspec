import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { templates } from '@/lib/templates';
import { useDrawingStore } from '@/stores/drawingStore';
import type { Drawing } from '@/lib/types';

const CATEGORY_META: Record<string, { icon: string; desc: string }> = {
  'Water Treatment': { icon: '💧', desc: 'Settlement tanks, basins, pump stations, treatment works' },
  'Pipework': { icon: '🔧', desc: 'Pipe sections, fittings, connections' },
  'Structural Steel': { icon: '🔩', desc: 'Beams, columns, connections, end plates' },
  'Civil/Structural': { icon: '🧱', desc: 'Retaining walls, foundations, earthworks' },
  'Drainage': { icon: '🕳️', desc: 'Manholes, inspection chambers, drainage runs' },
  'Architecture': { icon: '🏢', desc: 'Floor plans, elevations, sections' },
  'Civil': { icon: '🗺️', desc: 'Site layouts, road alignments, landscaping' },
};

export default function Templates() {
  const navigate = useNavigate();
  const { addDrawing } = useDrawingStore();

  const useTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    const newDrawing: Drawing = {
      id: `drawing-${Date.now()}`,
      name: template.name,
      description: template.description,
      spec: template.spec,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addDrawing(newDrawing);
    navigate(`/editor/${newDrawing.id}`);
  };

  const categories = [...new Set(templates.map((t) => t.category))];

  return (
    <div style={{ maxWidth: 720 }} className="animate-fade-in">
      <div style={{ marginBottom: 40 }}>
        <p className="font-meta" style={{ marginBottom: 10 }}>Library</p>
        <h1 className="font-headline" style={{ fontSize: 32, color: 'var(--text)', marginBottom: 8 }}>Templates</h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
          Pre-built engineering drawing templates. Click to create a new drawing.
        </p>
      </div>

      {categories.map((cat) => {
        const meta = CATEGORY_META[cat] || { icon: '📐', desc: '' };
        return (
          <div key={cat} className="ruled" style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>{meta.icon}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{cat}</p>
                {meta.desc && <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{meta.desc}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {templates.filter((t) => t.category === cat).map((t) => (
                <button key={t.id} onClick={() => useTemplate(t.id)} className="card"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                  }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 10,
                    background: 'var(--accent-light)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                  }}>
                    {t.thumbnail}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4, lineHeight: 1.5 }}>{t.description}</p>
                  </div>
                  <ArrowRight size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
