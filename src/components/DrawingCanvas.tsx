import { useRef, useState, useCallback, useEffect } from 'react';
import type { DrawingSpec, ViewSpec, Shape, Dimension, Label, TitleBlock } from '@/lib/types';
import { useDrawingStore } from '@/stores/drawingStore';

interface Props {
  spec: DrawingSpec;
  width?: number;
  height?: number;
}

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
        <button onClick={exportSVG} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">Export SVG</button>
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
          {/* Arrowhead */}
          <marker id="arrowStart" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 10 0 L 0 5 L 10 10 z" fill="#1a1a2e" />
          </marker>
          <marker id="arrowEnd" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1a1a2e" />
          </marker>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Drawing border */}
        <rect x="20" y="20" width={width - 40} height={height - 40} fill="none" stroke="#1a1a2e" strokeWidth="2" />
        <rect x="25" y="25" width={width - 50} height={height - 50} fill="none" stroke="#1a1a2e" strokeWidth="0.5" />

        {/* Views */}
        {spec.views.map((view) => (
          <g key={view.id} transform={`translate(${view.x}, ${view.y})`}>
            {/* Shapes */}
            {activeLayers.includes('structure') && view.shapes.map((shape, i) => (
              <RenderShape key={i} shape={shape} />
            ))}
            {/* Dimensions */}
            {activeLayers.includes('dimensions') && view.dimensions.map((dim) => (
              <RenderDimension key={dim.id} dim={dim} />
            ))}
            {/* Labels */}
            {activeLayers.includes('labels') && view.labels.map((label) => (
              <RenderLabel key={label.id} label={label} />
            ))}
          </g>
        ))}

        {/* Title Block */}
        <TitleBlockSVG block={spec.titleBlock} canvasWidth={width} canvasHeight={height} />
      </svg>
    </div>
  );
}

function RenderShape({ shape }: { shape: Shape }) {
  switch (shape.type) {
    case 'circle':
      return <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.fill || 'none'} stroke={shape.stroke || '#1a1a2e'} strokeWidth={shape.strokeWidth || 1} strokeDasharray={shape.dashed ? '8,4' : undefined} />;
    case 'rect':
      return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} fill={shape.fill || 'none'} stroke={shape.stroke || '#1a1a2e'} strokeWidth={shape.strokeWidth || 1} />;
    case 'line':
      return <line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} stroke={shape.stroke || '#1a1a2e'} strokeWidth={shape.strokeWidth || 1} strokeDasharray={shape.dashed ? '6,3' : undefined} />;
    case 'polyline': {
      const pts = shape.points.map(([x, y]) => `${x},${y}`).join(' ');
      return shape.closed
        ? <polygon points={pts} fill={shape.fill || 'none'} stroke={shape.stroke || '#1a1a2e'} strokeWidth={shape.strokeWidth || 1} />
        : <polyline points={pts} fill={shape.fill || 'none'} stroke={shape.stroke || '#1a1a2e'} strokeWidth={shape.strokeWidth || 1} />;
    }
    case 'arc': {
      const startRad = (shape.startAngle * Math.PI) / 180;
      const endRad = (shape.endAngle * Math.PI) / 180;
      const x1 = shape.cx + shape.r * Math.cos(startRad);
      const y1 = shape.cy - shape.r * Math.sin(startRad);
      const x2 = shape.cx + shape.r * Math.cos(endRad);
      const y2 = shape.cy - shape.r * Math.sin(endRad);
      const sweep = ((shape.endAngle - shape.startAngle + 360) % 360) > 180 ? 1 : 0;
      return <path d={`M ${x1} ${y1} A ${shape.r} ${shape.r} 0 ${sweep} 0 ${x2} ${y2}`} fill="none" stroke={shape.stroke || '#1a1a2e'} strokeWidth={shape.strokeWidth || 1} />;
    }
    case 'text':
      return <text x={shape.x} y={shape.y} fontSize={shape.fontSize || 12} textAnchor={shape.anchor || 'middle'} fill={shape.fill || '#1a1a2e'} transform={shape.rotate ? `rotate(${shape.rotate}, ${shape.x}, ${shape.y})` : undefined} style={{ fontFamily: 'monospace' }}>{shape.text}</text>;
    default:
      return null;
  }
}

function RenderDimension({ dim }: { dim: Dimension }) {
  const isVertical = Math.abs(dim.x2 - dim.x1) < Math.abs(dim.y2 - dim.y1);
  const midX = (dim.x1 + dim.x2) / 2;
  const midY = (dim.y1 + dim.y2) / 2;

  if (isVertical) {
    const ox = dim.offset;
    return (
      <g className="dimension">
        {/* Extension lines */}
        <line x1={dim.x1} y1={dim.y1} x2={dim.x1 + ox} y2={dim.y1} stroke="#1a1a2e" strokeWidth={0.5} />
        <line x1={dim.x2} y1={dim.y2} x2={dim.x2 + ox} y2={dim.y2} stroke="#1a1a2e" strokeWidth={0.5} />
        {/* Dimension line with arrows */}
        <line x1={dim.x1 + ox} y1={dim.y1} x2={dim.x2 + ox} y2={dim.y2}
          stroke="#1a1a2e" strokeWidth={0.7} markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" />
        {/* Text */}
        <text x={dim.x1 + ox - 8} y={midY} fontSize={10} textAnchor="end" fill="#1a1a2e"
          transform={`rotate(-90, ${dim.x1 + ox - 8}, ${midY})`}
          style={{ fontFamily: 'monospace', fontWeight: 600 }}>{dim.text}</text>
      </g>
    );
  }

  const oy = dim.offset;
  return (
    <g className="dimension">
      {/* Extension lines */}
      <line x1={dim.x1} y1={dim.y1} x2={dim.x1} y2={dim.y1 + oy} stroke="#1a1a2e" strokeWidth={0.5} />
      <line x1={dim.x2} y1={dim.y2} x2={dim.x2} y2={dim.y2 + oy} stroke="#1a1a2e" strokeWidth={0.5} />
      {/* Dimension line with arrows */}
      <line x1={dim.x1} y1={dim.y1 + oy} x2={dim.x2} y2={dim.y2 + oy}
        stroke="#1a1a2e" strokeWidth={0.7} markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" />
      {/* Text */}
      <rect x={midX - 30} y={dim.y1 + oy - 8} width={60} height={14} fill="white" />
      <text x={midX} y={dim.y1 + oy + 4} fontSize={10} textAnchor="middle" fill="#1a1a2e"
        style={{ fontFamily: 'monospace', fontWeight: 600 }}>{dim.text}</text>
    </g>
  );
}

function RenderLabel({ label }: { label: Label }) {
  const hasLeader = label.leaderX !== undefined && label.leaderY !== undefined;
  return (
    <g className="label">
      {hasLeader && (
        <line x1={label.x} y1={label.y} x2={label.leaderX!} y2={label.leaderY!}
          stroke="#64748b" strokeWidth={0.5} markerEnd="url(#arrowEnd)" />
      )}
      <text x={label.x} y={label.y - (hasLeader ? 6 : 0)} fontSize={label.fontSize || 11} textAnchor="middle" fill="#1a1a2e"
        style={{ fontFamily: 'monospace', fontWeight: label.fontSize && label.fontSize >= 14 ? 700 : 500 }}>
        {label.text.includes('\n')
          ? label.text.split('\n').map((line, i) => (
              <tspan key={i} x={label.x} dy={i === 0 ? 0 : 12}>{line}</tspan>
            ))
          : label.text}
      </text>
    </g>
  );
}

function TitleBlockSVG({ block, canvasWidth, canvasHeight }: { block: TitleBlock; canvasWidth: number; canvasHeight: number }) {
  const bx = canvasWidth - 320;
  const by = canvasHeight - 130;
  const bw = 290;
  const bh = 100;

  return (
    <g>
      <rect x={bx} y={by} width={bw} height={bh} fill="white" stroke="#1a1a2e" strokeWidth="1.5" />
      {/* Dividers */}
      <line x1={bx} y1={by + 25} x2={bx + bw} y2={by + 25} stroke="#1a1a2e" strokeWidth="0.5" />
      <line x1={bx} y1={by + 50} x2={bx + bw} y2={by + 50} stroke="#1a1a2e" strokeWidth="0.5" />
      <line x1={bx} y1={by + 75} x2={bx + bw} y2={by + 75} stroke="#1a1a2e" strokeWidth="0.5" />
      <line x1={bx + 145} y1={by + 50} x2={bx + 145} y2={by + bh} stroke="#1a1a2e" strokeWidth="0.5" />
      {/* Title */}
      <text x={bx + bw / 2} y={by + 17} fontSize={11} textAnchor="middle" fill="#1a1a2e" style={{ fontFamily: 'monospace', fontWeight: 700 }}>{block.title}</text>
      {/* Project */}
      <text x={bx + bw / 2} y={by + 42} fontSize={9} textAnchor="middle" fill="#64748b" style={{ fontFamily: 'monospace' }}>{block.project}</text>
      {/* Row 3 */}
      <text x={bx + 6} y={by + 63} fontSize={7} fill="#94a3b8" style={{ fontFamily: 'monospace' }}>DWG NO</text>
      <text x={bx + 6} y={by + 73} fontSize={9} fill="#1a1a2e" style={{ fontFamily: 'monospace', fontWeight: 600 }}>{block.drawingNo}</text>
      <text x={bx + 151} y={by + 63} fontSize={7} fill="#94a3b8" style={{ fontFamily: 'monospace' }}>REV</text>
      <text x={bx + 151} y={by + 73} fontSize={9} fill="#1a1a2e" style={{ fontFamily: 'monospace', fontWeight: 600 }}>{block.revision}</text>
      {/* Row 4 */}
      <text x={bx + 6} y={by + 88} fontSize={7} fill="#94a3b8" style={{ fontFamily: 'monospace' }}>DRAWN BY</text>
      <text x={bx + 6} y={by + 97} fontSize={9} fill="#1a1a2e" style={{ fontFamily: 'monospace' }}>{block.drawnBy}</text>
      <text x={bx + 151} y={by + 88} fontSize={7} fill="#94a3b8" style={{ fontFamily: 'monospace' }}>SCALE</text>
      <text x={bx + 151} y={by + 97} fontSize={9} fill="#1a1a2e" style={{ fontFamily: 'monospace' }}>{block.scale}</text>
      <text x={bx + 220} y={by + 88} fontSize={7} fill="#94a3b8" style={{ fontFamily: 'monospace' }}>DATE</text>
      <text x={bx + 220} y={by + 97} fontSize={9} fill="#1a1a2e" style={{ fontFamily: 'monospace' }}>{block.date}</text>
    </g>
  );
}
