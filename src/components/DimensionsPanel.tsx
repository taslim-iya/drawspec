import { useState } from 'react';
import { Ruler, ChevronDown, ChevronRight, Edit3, Check, X } from 'lucide-react';
import type { DrawingSpec, Dimension, ViewSpec } from '@/lib/types';

interface Props {
  spec: DrawingSpec;
  onSpecUpdate: (newSpec: DrawingSpec) => void;
}

export default function DimensionsPanel({ spec, onSpecUpdate }: Props) {
  const [expandedView, setExpandedView] = useState<string | null>(spec.views[0]?.id || null);
  const [editingDim, setEditingDim] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const updateDimension = (viewId: string, dimId: string, newText: string) => {
    const newSpec = {
      ...spec,
      views: spec.views.map((v) =>
        v.id === viewId
          ? { ...v, dimensions: v.dimensions.map((d) => d.id === dimId ? { ...d, text: newText } : d) }
          : v
      ),
    };
    onSpecUpdate(newSpec);
    setEditingDim(null);
  };

  const updateOffset = (viewId: string, dimId: string, delta: number) => {
    const newSpec = {
      ...spec,
      views: spec.views.map((v) =>
        v.id === viewId
          ? { ...v, dimensions: v.dimensions.map((d) => d.id === dimId ? { ...d, offset: d.offset + delta } : d) }
          : v
      ),
    };
    onSpecUpdate(newSpec);
  };

  const removeDimension = (viewId: string, dimId: string) => {
    const newSpec = {
      ...spec,
      views: spec.views.map((v) =>
        v.id === viewId
          ? { ...v, dimensions: v.dimensions.filter((d) => d.id !== dimId) }
          : v
      ),
    };
    onSpecUpdate(newSpec);
  };

  const addDimension = (viewId: string) => {
    const newDim: Dimension = {
      id: `dim-${Date.now()}`,
      type: 'linear',
      x1: 200, y1: 400,
      x2: 600, y2: 400,
      offset: -30,
      text: 'NEW DIM',
    };
    const newSpec = {
      ...spec,
      views: spec.views.map((v) =>
        v.id === viewId ? { ...v, dimensions: [...v.dimensions, newDim] } : v
      ),
    };
    onSpecUpdate(newSpec);
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--surface)' }}>
      <div className="p-4 ruled-bottom">
        <div className="flex items-center gap-2">
          <Ruler size={14} style={{ color: 'var(--accent)' }} />
          <span className="font-meta">Dimensions</span>
        </div>
      </div>

      {spec.views.map((view) => (
        <div key={view.id} style={{ borderBottom: '1px solid var(--border)' }}>
          {/* View header */}
          <button onClick={() => setExpandedView(expandedView === view.id ? null : view.id)}
            className="w-full flex items-center gap-2 px-4 py-3 text-left"
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
            {expandedView === view.id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            {view.label} ({view.dimensions.length})
          </button>

          {expandedView === view.id && (
            <div className="px-4 pb-3">
              {view.dimensions.length === 0 ? (
                <p style={{ fontSize: 12, color: 'var(--text-3)', padding: '8px 0' }}>No dimensions</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {view.dimensions.map((dim) => (
                    <div key={dim.id} className="card" style={{ padding: '10px 12px' }}>
                      <div className="flex items-center justify-between gap-2">
                        {editingDim === dim.id ? (
                          <div className="flex items-center gap-1 flex-1">
                            <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && updateDimension(view.id, dim.id, editValue)}
                              className="flex-1 px-2 py-1 text-xs border rounded"
                              style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)', color: 'var(--text)', outline: 'none' }}
                              autoFocus />
                            <button onClick={() => updateDimension(view.id, dim.id, editValue)}
                              style={{ color: 'var(--accent-2)' }}><Check size={12} /></button>
                            <button onClick={() => setEditingDim(null)}
                              style={{ color: 'var(--text-3)' }}><X size={12} /></button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{dim.text}</p>
                              <p style={{ fontSize: 10, color: 'var(--text-3)' }}>{dim.type} · offset: {dim.offset}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setEditingDim(dim.id); setEditValue(dim.text); }}
                                className="btn-ghost" style={{ padding: 4 }}><Edit3 size={11} /></button>
                              <button onClick={() => updateOffset(view.id, dim.id, -5)}
                                className="btn-ghost" style={{ padding: '2px 6px', fontSize: 10 }}>↑</button>
                              <button onClick={() => updateOffset(view.id, dim.id, 5)}
                                className="btn-ghost" style={{ padding: '2px 6px', fontSize: 10 }}>↓</button>
                              <button onClick={() => removeDimension(view.id, dim.id)}
                                className="btn-ghost" style={{ padding: 4, color: 'var(--danger)' }}><X size={11} /></button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => addDimension(view.id)}
                className="btn-secondary mt-3 w-full justify-center" style={{ fontSize: 11 }}>
                + Add Dimension
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Title Block Editor */}
      <div className="p-4">
        <p className="font-meta mb-3">Title Block</p>
        <div className="flex flex-col gap-2">
          {(['title', 'drawingNo', 'revision', 'scale', 'drawnBy', 'project'] as const).map((field) => (
            <div key={field}>
              <label style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{field.replace(/([A-Z])/g, ' $1')}</label>
              <input value={spec.titleBlock[field]}
                onChange={(e) => {
                  onSpecUpdate({
                    ...spec,
                    titleBlock: { ...spec.titleBlock, [field]: e.target.value },
                  });
                }}
                className="w-full mt-1 px-2 py-1.5 text-xs border rounded"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
