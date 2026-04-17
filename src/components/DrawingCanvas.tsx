import { useRef, useState, useCallback } from 'react';
import type { DrawingSpec, ViewSpec, Shape, Dimension, Label, TitleBlock } from '@/lib/types';
import { useDrawingStore } from '@/stores/drawingStore';

interface Props {
  spec: DrawingSpec;
  width?: number;
  height?: number;
}

// BS 8888 line weights (in SVG units)
const LINE = {
  THICK: 2.0,       // Visible edges, cut outlines
  MEDIUM: 1.2,      // General visible
  THIN: 0.5,        // Dimensions, extension, projection
  EXTRA_THIN: 0.3,  // Hatching, grid, background
};

// BS 8888 colours
const CLR = {
  INK: '#1a1a2e',
  DIM: '#1a1a2e',
  CENTERLINE: '#dc2626',
  CONSTRUCTION: '#94a3b8',
  WATER: '#3b82f6',
  HATCH: '#94a3b8',
  LABEL: '#64748b',
};

export default function DrawingCanvas({ spec, width = 1200, height = 1600 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoom, panX, panY, setZoom, setPan, activeLayers } = useDrawingStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(zoom + delta);
  }, [zoom, setZoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  }, [panX, panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan(e.clientX - dragStart.x, e.clientY - dragStart.y);
  }, [isDragging, dragStart, setPan]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const exportSVG = useCallback(() => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.titleBlock.drawingNo || 'drawing'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [spec]);

  // Export PDF via print
  const exportPDF = useCallback(() => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${spec.titleBlock.drawingNo}</title>
      <style>@page{size:A3 landscape;margin:0}body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh}</style>
      </head><body>${svgData}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  }, [spec]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-white"
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button onClick={() => setZoom(zoom + 0.2)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">+</button>
        <button onClick={() => setZoom(zoom - 0.2)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">−</button>
        <button onClick={() => { setZoom(1); setPan(0, 0); }} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">Fit</button>
        <button onClick={exportSVG} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">SVG</button>
        <button onClick={exportPDF} className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 shadow-sm">PDF</button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-white/90 border border-gray-200 rounded text-xs text-gray-500 font-mono">
        {Math.round(zoom * 100)}%
      </div>

      <svg ref={svgRef} width={width} height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`, transformOrigin: 'center center' }}
        xmlns="http://www.w3.org/2000/svg">
        
        {/* Background */}
        <rect width={width} height={height} fill="white" />
        
        {/* Grid */}
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" strokeWidth="0.3" />
          </pattern>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#smallGrid)" />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e8e8e8" strokeWidth="0.5" />
          </pattern>
          {/* BS 8888 compliant arrowheads (3:1 ratio, filled) */}
          <marker id="arrowStart" viewBox="0 0 12 6" refX="0" refY="3" markerWidth="8" markerHeight="4" orient="auto-start-reverse">
            <path d="M 12 0 L 0 3 L 12 6 z" fill={CLR.DIM} />
          </marker>
          <marker id="arrowEnd" viewBox="0 0 12 6" refX="12" refY="3" markerWidth="8" markerHeight="4" orient="auto">
            <path d="M 0 0 L 12 3 L 0 6 z" fill={CLR.DIM} />
          </marker>
          {/* Section cut circle marker */}
          <marker id="sectionDot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10">
            <circle cx="5" cy="5" r="4.5" fill="white" stroke={CLR.INK} strokeWidth="1" />
          </marker>
          {/* Hatching pattern: 45° lines for general material (BS 8888) */}
          <pattern id="hatch-general" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={CLR.HATCH} strokeWidth="0.4" />
          </pattern>
          {/* Hatching pattern: concrete (dots + irregular lines) */}
          <pattern id="hatch-concrete" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke={CLR.HATCH} strokeWidth="0.4" />
            <circle cx="5" cy="3" r="0.6" fill={CLR.HATCH} />
            <circle cx="3" cy="8" r="0.4" fill={CLR.HATCH} />
          </pattern>
          {/* Hatching pattern: earth (diagonal + dots) */}
          <pattern id="hatch-earth" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke={CLR.HATCH} strokeWidth="0.3" />
            <circle cx="4" cy="4" r="0.5" fill={CLR.HATCH} />
          </pattern>
          {/* Hatching pattern: steel (dense 45° lines) */}
          <pattern id="hatch-steel" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="3" stroke={CLR.HATCH} strokeWidth="0.5" />
          </pattern>
          {/* Hatching pattern: water (wavy horizontal lines) */}
          <pattern id="hatch-water" patternUnits="userSpaceOnUse" width="20" height="6">
            <path d="M0 3 Q5 1, 10 3 T20 3" fill="none" stroke={CLR.WATER} strokeWidth="0.4" />
          </pattern>
          {/* Section cut arrow marker (large filled, 30° included angle per BS 8888) */}
          <marker id="sectionArrow" viewBox="0 0 16 10" refX="16" refY="5" markerWidth="12" markerHeight="8" orient="auto">
            <path d="M 0 0 L 16 5 L 0 10 z" fill={CLR.INK} />
          </marker>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Drawing border (BS 8888: bordered drawing area) */}
        <rect x="20" y="20" width={width - 40} height={height - 40} fill="none" stroke={CLR.INK} strokeWidth="1.5" />

        {/* Views */}
        {spec.views.map((view) => (
          <g key={view.id} transform={`translate(${view.x}, ${view.y})`}>
            {/* Shapes (structure layer) */}
            {activeLayers.includes('structure') && view.shapes.map((shape, i) => (
              <RenderShape key={`s-${i}`} shape={shape} />
            ))}
            {/* Dimensions layer */}
            {activeLayers.includes('dimensions') && view.dimensions.map((dim) => (
              <RenderDimension key={dim.id} dim={dim} />
            ))}
            {/* Labels layer */}
            {activeLayers.includes('labels') && view.labels.map((label) => (
              <RenderLabel key={label.id} label={label} />
            ))}
          </g>
        ))}

        {/* Title Block */}
        <TitleBlockSVG block={spec.titleBlock} canvasWidth={width} canvasHeight={height} />

        {/* General Notes (bottom-left) */}
        <g transform={`translate(40, ${height - 180})`}>
          <text x="0" y="0" fontSize="9" fill={CLR.INK} style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em' }}>GENERAL NOTES</text>
          <line x1="0" y1="4" x2="120" y2="4" stroke={CLR.INK} strokeWidth={LINE.THIN} />
          {[
            '1. ALL DIMENSIONS IN MILLIMETRES UNLESS NOTED',
            '2. DO NOT SCALE THIS DRAWING',
            `3. DRAWING SCALE: ${spec.titleBlock.scale}`,
            `4. ALL LEVELS IN METRES ${spec.type === 'tank' || spec.type === 'basin' ? 'AOD' : 'ABOVE FFL'}`,
            spec.type === 'tank' || spec.type === 'basin' ? '5. ALL CONCRETE TO BE C35/45 MIN' : spec.type === 'beam' ? '5. STEEL GRADE S355 JR MIN' : '5. REFER TO SPEC FOR MATERIALS',
            '6. THIS DRAWING TO BE READ WITH THE SPECIFICATION',
          ].map((note, i) => (
            <text key={i} x="0" y={18 + i * 14} fontSize="7" fill={CLR.LABEL} style={{ fontFamily: 'monospace' }}>{note}</text>
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ─── Shape Renderer ─── */
function RenderShape({ shape }: { shape: Shape }) {
  // Determine stroke weight based on shape properties
  const sw = shape.strokeWidth || LINE.MEDIUM;
  const stroke = shape.stroke || CLR.INK;
  const dashArray = shape.dashed ? '8,4' : undefined;

  switch (shape.type) {
    case 'line':
      return <line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2}
        stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />;
    case 'rect':
      return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h}
        fill={shape.fill || 'none'} stroke={stroke} strokeWidth={sw}
        strokeDasharray={dashArray} />;
    case 'circle':
      return <circle cx={shape.cx} cy={shape.cy} r={shape.r}
        fill={shape.fill || 'none'} stroke={stroke} strokeWidth={sw}
        strokeDasharray={dashArray} />;
    case 'polyline': {
      const pts = (shape.points || []).map(([x, y]: [number, number]) => `${x},${y}`).join(' ');
      return shape.closed
        ? <polygon points={pts} fill={shape.fill || 'none'} stroke={stroke} strokeWidth={sw} />
        : <polyline points={pts} fill={shape.fill || 'none'} stroke={stroke} strokeWidth={sw} />;
    }
    case 'arc': {
      const startRad = (shape.startAngle * Math.PI) / 180;
      const endRad = (shape.endAngle * Math.PI) / 180;
      const x1 = shape.cx + shape.r * Math.cos(startRad);
      const y1 = shape.cy - shape.r * Math.sin(startRad);
      const x2 = shape.cx + shape.r * Math.cos(endRad);
      const y2 = shape.cy - shape.r * Math.sin(endRad);
      const sweep = ((shape.endAngle - shape.startAngle + 360) % 360) > 180 ? 1 : 0;
      return <path d={`M ${x1} ${y1} A ${shape.r} ${shape.r} 0 ${sweep} 0 ${x2} ${y2}`}
        fill="none" stroke={stroke} strokeWidth={sw} />;
    }
    case 'text':
      return <text x={shape.x} y={shape.y} fontSize={shape.fontSize || 12}
        textAnchor={shape.anchor || 'middle'} fill={shape.fill || CLR.INK}
        transform={shape.rotate ? `rotate(${shape.rotate}, ${shape.x}, ${shape.y})` : undefined}
        style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>{shape.text}</text>;
    default:
      return null;
  }
}

/* ─── BS 8888 Compliant Dimension Renderer ─── */
function RenderDimension({ dim }: { dim: Dimension }) {
  const isVertical = Math.abs(dim.x2 - dim.x1) < Math.abs(dim.y2 - dim.y1);
  const midX = (dim.x1 + dim.x2) / 2;
  const midY = (dim.y1 + dim.y2) / 2;
  const GAP = 3; // Gap between object and extension line (BS 8888)
  const OVERSHOOT = 3; // Extension line overshoots dimension line

  if (isVertical) {
    const ox = dim.offset;
    const dir = ox > 0 ? 1 : -1;
    return (
      <g className="dimension">
        {/* Extension lines (with gap from object) */}
        <line x1={dim.x1 + GAP * dir} y1={dim.y1} x2={dim.x1 + ox + OVERSHOOT * dir} y2={dim.y1}
          stroke={CLR.DIM} strokeWidth={LINE.THIN} />
        <line x1={dim.x2 + GAP * dir} y1={dim.y2} x2={dim.x2 + ox + OVERSHOOT * dir} y2={dim.y2}
          stroke={CLR.DIM} strokeWidth={LINE.THIN} />
        {/* Dimension line with arrowheads */}
        <line x1={dim.x1 + ox} y1={dim.y1} x2={dim.x2 + ox} y2={dim.y2}
          stroke={CLR.DIM} strokeWidth={LINE.THIN}
          markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" />
        {/* Text (rotated, placed left of vertical dim line) */}
        <rect x={dim.x1 + ox - 14} y={midY - 20} width={12} height={40} fill="white" />
        <text x={dim.x1 + ox - 8} y={midY} fontSize={9} textAnchor="middle" fill={CLR.DIM}
          transform={`rotate(-90, ${dim.x1 + ox - 8}, ${midY})`}
          style={{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.05em' }}>{dim.text}</text>
      </g>
    );
  }

  const oy = dim.offset;
  const dir = oy > 0 ? 1 : -1;
  return (
    <g className="dimension">
      {/* Extension lines (with gap from object) */}
      <line x1={dim.x1} y1={dim.y1 + GAP * dir} x2={dim.x1} y2={dim.y1 + oy + OVERSHOOT * dir}
        stroke={CLR.DIM} strokeWidth={LINE.THIN} />
      <line x1={dim.x2} y1={dim.y2 + GAP * dir} x2={dim.x2} y2={dim.y2 + oy + OVERSHOOT * dir}
        stroke={CLR.DIM} strokeWidth={LINE.THIN} />
      {/* Dimension line with arrowheads */}
      <line x1={dim.x1} y1={dim.y1 + oy} x2={dim.x2} y2={dim.y2 + oy}
        stroke={CLR.DIM} strokeWidth={LINE.THIN}
        markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" />
      {/* Text (centered above dimension line, with white background) */}
      <rect x={midX - 35} y={dim.y1 + oy - 8} width={70} height={14} fill="white" />
      <text x={midX} y={dim.y1 + oy + 4} fontSize={9} textAnchor="middle" fill={CLR.DIM}
        style={{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.05em' }}>{dim.text}</text>
    </g>
  );
}

/* ─── Label Renderer with Leader Lines ─── */
function RenderLabel({ label }: { label: Label }) {
  const hasLeader = label.leaderX !== undefined && label.leaderY !== undefined;
  return (
    <g className="label">
      {hasLeader && (
        <>
          <line x1={label.x} y1={label.y} x2={label.leaderX!} y2={label.leaderY!}
            stroke={CLR.LABEL} strokeWidth={LINE.THIN} markerEnd="url(#arrowEnd)" />
          {/* Small dot at text end of leader */}
          <circle cx={label.x} cy={label.y} r={1.5} fill={CLR.LABEL} />
        </>
      )}
      <text x={label.x} y={label.y - (hasLeader ? 6 : 0)} fontSize={label.fontSize || 11}
        textAnchor="middle" fill={CLR.INK}
        style={{ fontFamily: 'monospace', fontWeight: label.fontSize && label.fontSize >= 14 ? 700 : 500, letterSpacing: '0.05em' }}>
        {label.text.includes('\n')
          ? label.text.split('\n').map((line, i) => (
              <tspan key={i} x={label.x} dy={i === 0 ? 0 : (label.fontSize || 11) + 2}>{line}</tspan>
            ))
          : label.text}
      </text>
    </g>
  );
}

/* ─── BS 8888 Title Block ─── */
function TitleBlockSVG({ block, canvasWidth, canvasHeight }: { block: TitleBlock; canvasWidth: number; canvasHeight: number }) {
  const bx = canvasWidth - 340;
  const by = canvasHeight - 160;
  const bw = 310;
  const bh = 120;

  return (
    <g>
      {/* Main border (thick) */}
      <rect x={bx} y={by} width={bw} height={bh} fill="white" stroke={CLR.INK} strokeWidth={LINE.MEDIUM} />
      
      {/* Title row */}
      <line x1={bx} y1={by + 28} x2={bx + bw} y2={by + 28} stroke={CLR.INK} strokeWidth={LINE.THIN} />
      <text x={bx + bw / 2} y={by + 19} fontSize={12} textAnchor="middle" fill={CLR.INK}
        style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em' }}>{block.title}</text>
      
      {/* Project row */}
      <line x1={bx} y1={by + 52} x2={bx + bw} y2={by + 52} stroke={CLR.INK} strokeWidth={LINE.THIN} />
      <text x={bx + 8} y={by + 38} fontSize={7} fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>PROJECT</text>
      <text x={bx + 8} y={by + 48} fontSize={9} fill={CLR.INK} style={{ fontFamily: 'monospace', fontWeight: 600 }}>{block.project}</text>
      
      {/* Drawing No + Rev row */}
      <line x1={bx} y1={by + 80} x2={bx + bw} y2={by + 80} stroke={CLR.INK} strokeWidth={LINE.THIN} />
      <line x1={bx + 200} y1={by + 52} x2={bx + 200} y2={by + 80} stroke={CLR.INK} strokeWidth={LINE.THIN} />
      <text x={bx + 8} y={by + 63} fontSize={7} fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>DRAWING NO.</text>
      <text x={bx + 8} y={by + 75} fontSize={10} fill={CLR.INK} style={{ fontFamily: 'monospace', fontWeight: 700 }}>{block.drawingNo}</text>
      <text x={bx + 208} y={by + 63} fontSize={7} fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>REVISION</text>
      <text x={bx + 208} y={by + 75} fontSize={10} fill={CLR.INK} style={{ fontFamily: 'monospace', fontWeight: 700 }}>{block.revision}</text>
      
      {/* Bottom row: Drawn by / Scale / Date */}
      <line x1={bx + 110} y1={by + 80} x2={bx + 110} y2={by + bh} stroke={CLR.INK} strokeWidth={LINE.THIN} />
      <line x1={bx + 210} y1={by + 80} x2={bx + 210} y2={by + bh} stroke={CLR.INK} strokeWidth={LINE.THIN} />
      <text x={bx + 8} y={by + 92} fontSize={7} fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>DRAWN BY</text>
      <text x={bx + 8} y={by + 106} fontSize={9} fill={CLR.INK} style={{ fontFamily: 'monospace' }}>{block.drawnBy}</text>
      <text x={bx + 118} y={by + 92} fontSize={7} fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>SCALE</text>
      <text x={bx + 118} y={by + 106} fontSize={9} fill={CLR.INK} style={{ fontFamily: 'monospace', fontWeight: 600 }}>{block.scale}</text>
      <text x={bx + 218} y={by + 92} fontSize={7} fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>DATE</text>
      <text x={bx + 218} y={by + 106} fontSize={9} fill={CLR.INK} style={{ fontFamily: 'monospace' }}>{block.date}</text>

      {/* Notes block above title block */}
      <text x={bx + bw / 2} y={by - 24} fontSize={7} textAnchor="middle" fill={CLR.CONSTRUCTION}
        style={{ fontFamily: 'monospace', letterSpacing: '0.15em' }}>ALL DIMENSIONS IN MILLIMETRES UNLESS NOTED</text>
      <text x={bx + bw / 2} y={by - 12} fontSize={7} textAnchor="middle" fill={CLR.CONSTRUCTION}
        style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>DO NOT SCALE — IF IN DOUBT, ASK</text>

      {/* Revision table (single row for current rev) */}
      <g transform={`translate(${bx}, ${by - 60})`}>
        <rect x={0} y={0} width={bw} height={24} fill="none" stroke={CLR.INK} strokeWidth={LINE.THIN} />
        <line x1={30} y1={0} x2={30} y2={24} stroke={CLR.INK} strokeWidth={LINE.THIN} />
        <line x1={180} y1={0} x2={180} y2={24} stroke={CLR.INK} strokeWidth={LINE.THIN} />
        <line x1={240} y1={0} x2={240} y2={24} stroke={CLR.INK} strokeWidth={LINE.THIN} />
        <text x={15} y={15} fontSize={8} textAnchor="middle" fill={CLR.INK} style={{ fontFamily: 'monospace', fontWeight: 700 }}>{block.revision}</text>
        <text x={105} y={15} fontSize={7} textAnchor="middle" fill={CLR.INK} style={{ fontFamily: 'monospace' }}>PRELIMINARY ISSUE</text>
        <text x={210} y={15} fontSize={7} textAnchor="middle" fill={CLR.INK} style={{ fontFamily: 'monospace' }}>{block.drawnBy}</text>
        <text x={265} y={15} fontSize={7} textAnchor="middle" fill={CLR.INK} style={{ fontFamily: 'monospace' }}>{block.date}</text>
        {/* Header labels */}
        <text x={15} y={-3} fontSize={6} textAnchor="middle" fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>REV</text>
        <text x={105} y={-3} fontSize={6} textAnchor="middle" fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>DESCRIPTION</text>
        <text x={210} y={-3} fontSize={6} textAnchor="middle" fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>BY</text>
        <text x={265} y={-3} fontSize={6} textAnchor="middle" fill={CLR.CONSTRUCTION} style={{ fontFamily: 'monospace' }}>DATE</text>
      </g>
    </g>
  );
}
