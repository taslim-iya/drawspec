import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Ruler, Tag, Type, Layers, MessageSquare, Download, ChevronRight } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawingStore';
import { templates } from '@/lib/templates';
import DrawingCanvas from '@/components/DrawingCanvas';
import ChatPanel from '@/components/ChatPanel';
import type { Drawing, DrawingSpec } from '@/lib/types';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { drawings, addDrawing, updateDrawing, setActiveDrawing, activeLayers, toggleLayer } = useDrawingStore();
  const [textInput, setTextInput] = useState('');
  const [parsing, setParsing] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [showChat, setShowChat] = useState(true);

  const drawing = drawings.find((d) => d.id === id);

  useEffect(() => {
    if (id) setActiveDrawing(id);
    return () => setActiveDrawing(null);
  }, [id, setActiveDrawing]);

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setParsing(true);

    // Try AI parsing
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textInput }),
      });
      const data = await res.json();
      if (data.content) {
        const parsed = JSON.parse(data.content);
        // Build a DrawingSpec from AI output
        const newDrawing: Drawing = {
          id: `drawing-${Date.now()}`,
          name: parsed.title || 'AI Generated Drawing',
          description: textInput,
          spec: buildSpecFromAI(parsed),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addDrawing(newDrawing);
        navigate(`/editor/${newDrawing.id}`);
        setParsing(false);
        return;
      }
    } catch {
      // Fallback to demo
    }

    // Fallback: create from first template
    const newDrawing: Drawing = {
      id: `drawing-${Date.now()}`,
      name: 'Custom Drawing',
      description: textInput,
      spec: templates[0].spec,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addDrawing(newDrawing);
    navigate(`/editor/${newDrawing.id}`);
    setParsing(false);
  };

  const layers = [
    { id: 'structure', label: 'Structure', icon: Layers, color: '#1a1a2e' },
    { id: 'dimensions', label: 'Dimensions', icon: Ruler, color: '#1a1a2e' },
    { id: 'labels', label: 'Labels', icon: Tag, color: '#64748b' },
    { id: 'annotations', label: 'Notes', icon: MessageSquare, color: '#3b82f6' },
  ];

  // No drawing selected — show text input
  if (!drawing) {
    return (
      <div className="flex h-full">
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
          <div className="max-w-xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a Drawing</h2>
            <p className="text-gray-500 text-sm mb-6">Describe your engineering drawing in plain English, or choose a template.</p>

            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g., 25m diameter circular settlement tank with 2m sidewall height, 7.5° floor slope, 250mm wall thickness, central inlet pipe DN300, peripheral outlet DN400"
              className="w-full h-40 p-4 border border-gray-200 rounded-xl text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
            />
            <button onClick={handleTextSubmit} disabled={parsing || !textInput.trim()}
              className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {parsing ? 'Parsing specification...' : 'Generate Drawing'}
            </button>

            <div className="mt-8">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Or start from a template</p>
              <div className="grid gap-2">
                {templates.map((t) => (
                  <button key={t.id} onClick={() => {
                    const newDrawing: Drawing = {
                      id: `drawing-${Date.now()}`,
                      name: t.name,
                      description: t.description,
                      spec: t.spec,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    };
                    addDrawing(newDrawing);
                    navigate(`/editor/${newDrawing.id}`);
                  }}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-left">
                    <span className="text-lg">{t.thumbnail}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.description.slice(0, 60)}...</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Layer panel */}
      {showPanel && (
        <div className="w-56 bg-white border-r border-gray-200 p-4 flex flex-col">
          <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Drawing</h3>
          <p className="text-sm font-semibold text-gray-900 mb-1">{drawing.name}</p>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">{drawing.description?.slice(0, 120)}</p>

          <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Layers</h3>
          <div className="flex flex-col gap-1 mb-6">
            {layers.map((layer) => {
              const active = activeLayers.includes(layer.id);
              return (
                <button key={layer.id} onClick={() => toggleLayer(layer.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    active ? 'bg-gray-50 text-gray-900' : 'text-gray-400 hover:bg-gray-50'
                  }`}>
                  {active ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span className="w-2 h-2 rounded-full" style={{ background: active ? layer.color : '#d1d5db' }} />
                  {layer.label}
                </button>
              );
            })}
          </div>

          <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Title Block</h3>
          <div className="text-xs text-gray-500 space-y-1">
            <p><span className="text-gray-400">No:</span> {drawing.spec.titleBlock.drawingNo}</p>
            <p><span className="text-gray-400">Rev:</span> {drawing.spec.titleBlock.revision}</p>
            <p><span className="text-gray-400">Scale:</span> {drawing.spec.titleBlock.scale}</p>
            <p><span className="text-gray-400">Date:</span> {drawing.spec.titleBlock.date}</p>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <button onClick={() => setShowPanel(!showPanel)}
            className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <Layers size={16} className="text-gray-500" />
          </button>
          <button onClick={() => setShowChat(!showChat)}
            className={`p-2 border rounded-lg shadow-sm transition-colors ${showChat ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            <MessageSquare size={16} />
          </button>
        </div>
        <DrawingCanvas spec={drawing.spec} />
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="w-80">
          <ChatPanel
            spec={drawing.spec}
            drawingName={drawing.name}
            onSpecUpdate={(newSpec) => {
              updateDrawing(drawing.id, { spec: newSpec });
            }}
          />
        </div>
      )}
    </div>
  );
}

function buildSpecFromAI(parsed: any): DrawingSpec {
  // Fallback spec builder — real AI would return structured data
  return templates[0].spec;
}
