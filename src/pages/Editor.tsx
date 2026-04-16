import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Ruler, Tag, Layers, MessageSquare, ChevronRight, Upload } from 'lucide-react';
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
  const { drawings, addDrawing, updateDrawing, setActiveDrawing, activeLayers, toggleLayer } = useDrawingStore();
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
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textInput }),
      });
      const data = await res.json();
      if (data.content) {
        const parsed = JSON.parse(data.content);
        createFromSpec(buildSpecFromAI(parsed, textInput), parsed.title || 'AI Drawing');
        setParsing(false);
        return;
      }
    } catch { /* fallback */ }
    createFromSpec(templates[0].spec, 'Custom Drawing');
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
  return templates[0].spec;
}
