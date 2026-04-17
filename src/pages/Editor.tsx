import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Ruler, Tag, Layers, MessageSquare, ChevronRight, Upload, Undo2, Trash2 } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawingStore';
import { templates } from '@/lib/templates';
import DrawingCanvas from '@/components/DrawingCanvas';
import ChatPanel from '@/components/ChatPanel';
import DimensionsPanel from '@/components/DimensionsPanel';
import FileUpload from '@/components/FileUpload';
import type { Drawing, DrawingSpec } from '@/lib/types';

type RightPanel = 'chat' | 'dimensions' | null;

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { drawings, addDrawing, updateDrawing, removeDrawing, undoDrawing, setActiveDrawing, activeLayers, toggleLayer, history } = useDrawingStore();
  const [textInput, setTextInput] = useState('');
  const [parsing, setParsing] = useState(false);
  const [showLeft, setShowLeft] = useState(true);
  const [rightPanel, setRightPanel] = useState<RightPanel>('chat');

  const drawing = drawings.find((d) => d.id === id);

  useEffect(() => {
    if (id) setActiveDrawing(id);
    return () => setActiveDrawing(null);
  }, [id, setActiveDrawing]);

  const createFromSpec = (spec: DrawingSpec, name: string) => {
    const newDrawing: Drawing = {
      id: `drawing-${Date.now()}`,
      name,
      description: '',
      spec,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addDrawing(newDrawing);
    navigate(`/editor/${newDrawing.id}`);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setParsing(true);
    try {
      const localKey = localStorage.getItem('drawspec-openai-key') || '';
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textInput, apiKey: localKey }),
      });
      const data = await res.json();
      const raw = data.content || '';
      if (raw) {
        // Strip markdown code fences if present
        const jsonStr = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        createFromSpec(buildSpecFromAI(parsed, textInput), parsed.title || 'AI Drawing');
        setParsing(false);
        return;
      }
      if (data.error) {
        console.error('AI error:', data.error);
      }
    } catch (err) {
      console.error('AI parse error:', err);
    }
    // Only fall back to template if AI completely fails
    createFromSpec(buildSpecFromAI({
      title: textInput.slice(0, 40).toUpperCase(),
      type: 'custom',
      dimensions: {},
      features: [],
      notes: ['AI generation failed — edit via chat panel'],
    }, textInput), textInput.slice(0, 40));
    setParsing(false);
  };

  const layers = [
    { id: 'structure', label: 'Structure', color: 'var(--text)' },
    { id: 'dimensions', label: 'Dimensions', color: 'var(--text)' },
    { id: 'labels', label: 'Labels', color: 'var(--text-2)' },
    { id: 'annotations', label: 'Notes', color: 'var(--accent)' },
  ];

  // No drawing — show creation view
  if (!drawing) {
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ maxWidth: 560, width: '100%' }}>
            <h2 className="font-headline" style={{ fontSize: 28, color: 'var(--text)', marginBottom: 6 }}>Create a Drawing</h2>
            <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 32 }}>Describe it, upload a file, or start from a template.</p>

            {/* Text input */}
            <div className="ruled" style={{ marginBottom: 24 }}>
              <p className="font-meta" style={{ marginBottom: 12 }}>From Text</p>
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g., 25m diameter circular settlement tank with 2m sidewall height, 7.5° floor slope, 250mm wall thickness"
                style={{
                  width: '100%', height: 120, padding: 14, border: '1px solid var(--border)',
                  borderRadius: 8, fontSize: 13, background: 'var(--surface)', color: 'var(--text)',
                  resize: 'none', outline: 'none', fontFamily: 'var(--font-body)',
                }} />
              <button onClick={handleTextSubmit} disabled={parsing || !textInput.trim()}
                className="btn-primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center', padding: '12px 16px' }}>
                {parsing ? 'Generating...' : 'Generate Drawing'}
              </button>
            </div>

            {/* File upload */}
            <div className="ruled" style={{ marginBottom: 24 }}>
              <p className="font-meta" style={{ marginBottom: 12 }}>Upload File</p>
              <FileUpload onParsed={(spec, name) => createFromSpec(spec, name.replace(/\.[^.]+$/, ''))} />
            </div>

            {/* Templates */}
            <div className="ruled">
              <p className="font-meta" style={{ marginBottom: 12 }}>Templates</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {templates.map((t) => (
                  <button key={t.id} onClick={() => createFromSpec(t.spec, t.name)}
                    className="card" style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                      cursor: 'pointer', textAlign: 'left', width: '100%', border: '1px solid var(--border)',
                    }}>
                    <span style={{ fontSize: 20 }}>{t.thumbnail}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{t.description.slice(0, 70)}...</p>
                    </div>
                    <ChevronRight size={14} style={{ color: 'var(--text-3)' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Drawing editor view
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Left panel — layers + info */}
      {showLeft && (
        <div style={{ width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
            <p className="font-meta" style={{ marginBottom: 8 }}>Drawing</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{drawing.name}</p>
            <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>{drawing.description?.slice(0, 100)}</p>
          </div>

          <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
            <p className="font-meta" style={{ marginBottom: 8 }}>Layers</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {layers.map((layer) => {
                const active = activeLayers.includes(layer.id);
                return (
                  <button key={layer.id} onClick={() => toggleLayer(layer.id)}
                    className="btn-ghost" style={{
                      justifyContent: 'flex-start', fontSize: 12, padding: '6px 10px',
                      color: active ? 'var(--text)' : 'var(--text-3)',
                      background: active ? 'var(--bg-alt)' : 'transparent',
                    }}>
                    {active ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: active ? layer.color : 'var(--border)' }} />
                    {layer.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
            <p className="font-meta" style={{ marginBottom: 8 }}>Views</p>
            {drawing.spec.views.map((v) => (
              <div key={v.id} style={{ fontSize: 12, color: 'var(--text-2)', padding: '4px 0' }}>
                {v.label} — {v.shapes.length} shapes, {v.dimensions.length} dims
              </div>
            ))}
          </div>

          <div style={{ padding: 16 }}>
            <p className="font-meta" style={{ marginBottom: 8 }}>Title Block</p>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
              <p><span style={{ color: 'var(--text-3)' }}>No:</span> {drawing.spec.titleBlock.drawingNo}</p>
              <p><span style={{ color: 'var(--text-3)' }}>Rev:</span> {drawing.spec.titleBlock.revision}</p>
              <p><span style={{ color: 'var(--text-3)' }}>Scale:</span> {drawing.spec.titleBlock.scale}</p>
            </div>
          </div>

          {/* Upload new file */}
          <div style={{ padding: 16, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
            <FileUpload onParsed={(spec, name) => {
              updateDrawing(drawing.id, { spec, name: name.replace(/\.[^.]+$/, '') });
            }} />
          </div>
        </div>
      )}

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Toolbar */}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 20, display: 'flex', gap: 6 }}>
          <button onClick={() => setShowLeft(!showLeft)}
            className="btn-secondary" style={{ padding: 8 }}>
            <Layers size={15} />
          </button>
          <button onClick={() => setRightPanel(rightPanel === 'chat' ? null : 'chat')}
            className={rightPanel === 'chat' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: 8 }}>
            <MessageSquare size={15} />
          </button>
          <button onClick={() => setRightPanel(rightPanel === 'dimensions' ? null : 'dimensions')}
            className={rightPanel === 'dimensions' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: 8 }}>
            <Ruler size={15} />
          </button>
          {drawing && (history[drawing.id]?.length || 0) > 0 && (
            <button onClick={() => undoDrawing(drawing.id)}
              className="btn-secondary" style={{ padding: 8 }} title="Undo last change">
              <Undo2 size={15} />
            </button>
          )}
          {drawing && drawing.id !== 'demo-fst' && (
            <button onClick={() => { if (confirm(`Delete "${drawing.name}"?`)) { removeDrawing(drawing.id); navigate('/'); } }}
              className="btn-secondary" style={{ padding: 8, color: 'var(--danger)' }} title="Delete drawing">
              <Trash2 size={15} />
            </button>
          )}
        </div>
        <DrawingCanvas spec={drawing.spec} />
      </div>

      {/* Right panel */}
      {rightPanel === 'chat' && (
        <div style={{ width: 320 }}>
          <ChatPanel spec={drawing.spec} drawingName={drawing.name}
            onSpecUpdate={(newSpec) => updateDrawing(drawing.id, { spec: newSpec })} />
        </div>
      )}
      {rightPanel === 'dimensions' && (
        <div style={{ width: 300 }}>
          <DimensionsPanel spec={drawing.spec}
            onSpecUpdate={(newSpec) => updateDrawing(drawing.id, { spec: newSpec })} />
        </div>
      )}
    </div>
  );
}

function buildSpecFromAI(parsed: any, description: string): DrawingSpec {
  const dims = parsed.dimensions || {};
  const features = parsed.features || [];
  const type = (parsed.type || 'custom') as DrawingSpec['type'];
  const title = (parsed.title || description.slice(0, 40)).toUpperCase();

  // Try to extract key dimensions
  const diameterMm = parseFloat(dims.diameter || dims.outer_diameter || '0');
  const heightMm = parseFloat(dims.height || dims.wall_height || dims.sidewall_height || dims.depth || dims.hopper_depth || '0');
  const widthMm = parseFloat(dims.width || '0');
  const lengthMm = parseFloat(dims.length || '0');
  const wallMm = parseFloat(dims.wall_thickness || dims.thickness || '250');

  // Canvas coordinates (we scale real mm to SVG coords)
  const cx = 400, cy = 300;
  const shapes: any[] = [];
  const dimensions: any[] = [];
  const labels: any[] = [];

  if ((type === 'tank' || type === 'pipe' || diameterMm > 0) && diameterMm > 0 && !lengthMm) {
    // Circular tank
    const r = 220; // SVG radius
    const innerR = r - Math.max(8, (wallMm / diameterMm) * r * 2);
    // Outer wall (concrete hatching between outer and inner circles not possible with SVG fill, use thick stroke)
    shapes.push({ type: 'circle', cx, cy, r, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2.5 });
    shapes.push({ type: 'circle', cx, cy, r: innerR, fill: 'none', stroke: '#1a1a2e', strokeWidth: 1.5 });
    shapes.push({ type: 'circle', cx, cy, r: 15, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 2 }); // central column
    // Center lines (chain dash-dot, BS 8888)
    shapes.push({ type: 'line', x1: cx - r - 20, y1: cy, x2: cx + r + 20, y2: cy, stroke: '#dc2626', strokeWidth: 0.4, dashed: true });
    shapes.push({ type: 'line', x1: cx, y1: cy - r - 20, x2: cx, y2: cy + r + 20, stroke: '#dc2626', strokeWidth: 0.4, dashed: true });
    // Dimensions
    dimensions.push({ id: 'dim-dia', type: 'diameter', x1: cx - r, y1: cy + r + 30, x2: cx + r, y2: cy + r + 30, offset: 25, text: `Ø${diameterMm}` });
    if (wallMm) dimensions.push({ id: 'dim-wall', type: 'linear', x1: cx + innerR, y1: cy - r - 10, x2: cx + r, y2: cy - r - 10, offset: -20, text: `${wallMm}` });
    labels.push({ id: 'lbl-title', x: cx, y: 30, text: title, fontSize: 14 });
    if (heightMm > 0) labels.push({ id: 'lbl-depth', x: cx, y: cy + 30, text: `SWD: ${heightMm}mm`, fontSize: 9 });
  } else if ((type === 'basin' || widthMm > 0) && (widthMm > 0 || lengthMm > 0)) {
    // Rectangular structure
    const aspectRatio = lengthMm > 0 && widthMm > 0 ? lengthMm / widthMm : 1.67;
    const maxW = 520;
    const w = maxW;
    const h = Math.min(400, Math.round(w / aspectRatio));
    const wallPx = Math.max(8, Math.round(wallMm / ((lengthMm || widthMm || 10000) / w)));
    // Outer wall (hatched for concrete)
    shapes.push({ type: 'rect', x: cx - w/2, y: cy - h/2, w, h, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2.5 });
    // Inner void
    shapes.push({ type: 'rect', x: cx - w/2 + wallPx, y: cy - h/2 + wallPx, w: w - wallPx*2, h: h - wallPx*2, fill: 'white', stroke: '#1a1a2e', strokeWidth: 1.5 });
    // Center lines
    shapes.push({ type: 'line', x1: cx, y1: cy - h/2 - 15, x2: cx, y2: cy + h/2 + 15, stroke: '#dc2626', strokeWidth: 0.3, dashed: true });
    shapes.push({ type: 'line', x1: cx - w/2 - 15, y1: cy, x2: cx + w/2 + 15, y2: cy, stroke: '#dc2626', strokeWidth: 0.3, dashed: true });
    // Length dimension (horizontal)
    dimensions.push({ id: 'dim-l', type: 'linear', x1: cx - w/2, y1: cy + h/2 + 10, x2: cx + w/2, y2: cy + h/2 + 10, offset: 25, text: `${lengthMm || widthMm}` });
    // Width dimension (vertical)
    if (widthMm > 0 && lengthMm > 0) {
      dimensions.push({ id: 'dim-w', type: 'linear', x1: cx + w/2 + 10, y1: cy - h/2, x2: cx + w/2 + 10, y2: cy + h/2, offset: 25, text: `${widthMm}` });
    }
    // Wall thickness dimension
    dimensions.push({ id: 'dim-wall', type: 'linear', x1: cx - w/2, y1: cy - h/2 - 10, x2: cx - w/2 + wallPx, y2: cy - h/2 - 10, offset: -20, text: `${wallMm}` });
    labels.push({ id: 'lbl-title', x: cx, y: 30, text: title, fontSize: 14 });
    // Depth note if available
    if (heightMm > 0) labels.push({ id: 'lbl-depth', x: cx, y: cy, text: `DEPTH: ${heightMm}mm`, fontSize: 9 });
  } else {
    // Generic — show parsed info as text
    shapes.push({ type: 'rect', x: 100, y: 100, w: 600, h: 400, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2 });
    labels.push({ id: 'lbl-title', x: cx, y: 60, text: title, fontSize: 14 });
    let yPos = 280;
    for (const [k, v] of Object.entries(dims)) {
      labels.push({ id: `lbl-${k}`, x: cx, y: yPos, text: `${String(k).replace(/_/g, ' ')}: ${v}`, fontSize: 10 });
      yPos += 18;
    }
  }

  // Add feature annotations
  features.forEach((f: string, i: number) => {
    labels.push({ id: `feat-${i}`, x: 100, y: 620 + i * 16, text: `${i + 1}. ${f}`, fontSize: 9 });
  });

  return {
    type,
    unit: 'mm',
    views: [{
      id: 'plan',
      type: 'plan',
      label: 'PLAN VIEW',
      x: 80, y: 60,
      scale: diameterMm > 0 ? Math.min(1, 800 / diameterMm) : 1,
      shapes,
      dimensions,
      labels,
    }],
    titleBlock: {
      title,
      drawingNo: `${type === 'tank' ? 'TNK' : type === 'basin' ? 'BSN' : type === 'pipe' ? 'PIP' : type === 'beam' ? 'STL' : type === 'foundation' ? 'FND' : 'DRW'}-001-GA`,
      revision: 'P01',
      date: new Date().toISOString().split('T')[0],
      drawnBy: 'AI Generated',
      scale: diameterMm > 0 ? `1:${Math.round(diameterMm / 10)}` : 'NTS',
      project: parsed.project || description.slice(0, 30).toUpperCase(),
    },
  };
}
