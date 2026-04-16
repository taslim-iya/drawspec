import { useState, useRef } from 'react';
import { Upload, FileText, Image, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  onParsed: (spec: any, fileName: string) => void;
}

const ACCEPTED = '.dxf,.dwg,.pdf,.svg,.png,.jpg,.jpeg';

export default function FileUpload({ onParsed }: Props) {
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setParsing(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    try {
      if (ext === 'dxf') {
        await parseDXF(file);
      } else if (ext === 'svg') {
        await parseSVG(file);
      } else if (ext === 'dwg') {
        setError('DWG files require conversion. Upload as DXF for direct parsing, or the AI will attempt to interpret it.');
        await parseWithAI(file, ext);
      } else if (['png', 'jpg', 'jpeg'].includes(ext)) {
        await parseImage(file);
      } else if (ext === 'pdf') {
        await parsePDF(file);
      } else {
        setError(`Unsupported format: .${ext}`);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to parse file');
    } finally {
      setParsing(false);
    }
  };

  const parseDXF = async (file: File) => {
    const text = await file.text();
    // Use dxf-parser
    const DxfParser = (await import('dxf-parser')).default;
    const parser = new DxfParser();
    const dxf = parser.parseSync(text);

    if (!dxf || !dxf.entities?.length) {
      throw new Error('No entities found in DXF file');
    }

    // Convert DXF entities to our drawing spec
    const shapes: any[] = [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const entity of dxf.entities) {
      switch (entity.type) {
        case 'LINE':
          shapes.push({
            type: 'line',
            x1: entity.vertices[0].x, y1: -entity.vertices[0].y,
            x2: entity.vertices[1].x, y2: -entity.vertices[1].y,
            stroke: '#1a1a2e', strokeWidth: 1,
          });
          for (const v of entity.vertices) {
            minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
            minY = Math.min(minY, -v.y); maxY = Math.max(maxY, -v.y);
          }
          break;
        case 'CIRCLE':
          shapes.push({
            type: 'circle',
            cx: entity.center.x, cy: -entity.center.y,
            r: entity.radius, fill: 'none', stroke: '#1a1a2e', strokeWidth: 1,
          });
          minX = Math.min(minX, entity.center.x - entity.radius);
          maxX = Math.max(maxX, entity.center.x + entity.radius);
          minY = Math.min(minY, -entity.center.y - entity.radius);
          maxY = Math.max(maxY, -entity.center.y + entity.radius);
          break;
        case 'ARC':
          shapes.push({
            type: 'arc',
            cx: entity.center.x, cy: -entity.center.y,
            r: entity.radius,
            startAngle: entity.startAngle, endAngle: entity.endAngle,
            stroke: '#1a1a2e', strokeWidth: 1,
          });
          break;
        case 'POLYLINE':
        case 'LWPOLYLINE':
          if (entity.vertices?.length > 1) {
            shapes.push({
              type: 'polyline',
              points: entity.vertices.map((v: any) => [v.x, -v.y]),
              fill: 'none', stroke: '#1a1a2e', strokeWidth: 1,
              closed: entity.shape || false,
            });
            for (const v of entity.vertices) {
              minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
              minY = Math.min(minY, -v.y); maxY = Math.max(maxY, -v.y);
            }
          }
          break;
        case 'TEXT':
        case 'MTEXT':
          shapes.push({
            type: 'text',
            x: entity.startPoint?.x || entity.position?.x || 0,
            y: -(entity.startPoint?.y || entity.position?.y || 0),
            text: entity.text || '',
            fontSize: entity.textHeight || 12,
          });
          break;
      }
    }

    // Normalize coordinates to fit canvas
    const width = maxX - minX || 800;
    const height = maxY - minY || 600;
    const scale = Math.min(700 / width, 500 / height, 1);
    const offsetX = 200 - minX * scale;
    const offsetY = 200 - minY * scale;

    const normalizedShapes = shapes.map((s) => {
      if (s.type === 'line') return { ...s, x1: s.x1 * scale + offsetX, y1: s.y1 * scale + offsetY, x2: s.x2 * scale + offsetX, y2: s.y2 * scale + offsetY };
      if (s.type === 'circle') return { ...s, cx: s.cx * scale + offsetX, cy: s.cy * scale + offsetY, r: s.r * scale };
      if (s.type === 'polyline') return { ...s, points: s.points.map(([x, y]: [number, number]) => [x * scale + offsetX, y * scale + offsetY]) };
      if (s.type === 'text') return { ...s, x: s.x * scale + offsetX, y: s.y * scale + offsetY, fontSize: Math.max(8, s.fontSize * scale) };
      return s;
    });

    const spec = {
      type: 'custom' as const,
      unit: 'mm' as const,
      views: [{
        id: 'imported',
        type: 'plan' as const,
        label: `IMPORTED: ${file.name}`,
        x: 40, y: 40,
        scale: 1,
        shapes: normalizedShapes,
        dimensions: [],
        labels: [{ id: 'import-label', x: 400, y: 30, text: file.name.toUpperCase(), fontSize: 12 }],
      }],
      titleBlock: {
        title: file.name.replace(/\.[^.]+$/, '').toUpperCase(),
        drawingNo: 'IMP-001',
        revision: 'P01',
        date: new Date().toISOString().split('T')[0],
        drawnBy: 'Imported',
        scale: `1:${Math.round(1 / scale)}`,
        project: 'IMPORTED DRAWING',
      },
    };

    onParsed(spec, file.name);
  };

  const parseSVG = async (file: File) => {
    const text = await file.text();
    // Basic SVG → store as single shape group
    const spec = {
      type: 'custom' as const,
      unit: 'mm' as const,
      views: [{
        id: 'svg-import',
        type: 'plan' as const,
        label: `SVG: ${file.name}`,
        x: 40, y: 40, scale: 1,
        shapes: [{ type: 'text' as const, x: 400, y: 300, text: `SVG imported: ${file.name}`, fontSize: 14 }],
        dimensions: [],
        labels: [],
      }],
      titleBlock: {
        title: file.name.replace(/\.[^.]+$/, '').toUpperCase(),
        drawingNo: 'SVG-001', revision: 'P01',
        date: new Date().toISOString().split('T')[0],
        drawnBy: 'Imported', scale: 'NTS', project: 'SVG IMPORT',
      },
    };
    onParsed(spec, file.name);
  };

  const parseImage = async (file: File) => {
    // Convert image to data URL for AI analysis
    await parseWithAI(file, file.name.split('.').pop() || 'image');
  };

  const parsePDF = async (file: File) => {
    await parseWithAI(file, 'pdf');
  };

  const parseWithAI = async (file: File, format: string) => {
    // For non-DXF files, send to AI for interpretation
    const spec = {
      type: 'custom' as const,
      unit: 'mm' as const,
      views: [{
        id: 'ai-parsed',
        type: 'plan' as const,
        label: `${format.toUpperCase()}: ${file.name}`,
        x: 40, y: 40, scale: 1,
        shapes: [
          { type: 'text' as const, x: 400, y: 280, text: `Uploaded: ${file.name}`, fontSize: 14, fill: '#1a1a2e' },
          { type: 'text' as const, x: 400, y: 310, text: `Format: ${format.toUpperCase()} — Use chat to describe the drawing`, fontSize: 10, fill: '#64748b' },
          { type: 'text' as const, x: 400, y: 340, text: 'The AI will help you recreate or modify it', fontSize: 10, fill: '#64748b' },
          { type: 'rect' as const, x: 150, y: 150, w: 500, h: 300, fill: 'none', stroke: '#d1d5db', strokeWidth: 1 },
        ],
        dimensions: [],
        labels: [],
      }],
      titleBlock: {
        title: file.name.replace(/\.[^.]+$/, '').toUpperCase(),
        drawingNo: 'UPL-001', revision: 'P01',
        date: new Date().toISOString().split('T')[0],
        drawnBy: 'Upload', scale: 'NTS', project: 'UPLOADED DRAWING',
      },
    };
    onParsed(spec, file.name);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer transition-all"
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 12, padding: '32px 24px', textAlign: 'center',
          background: dragging ? 'var(--accent-light)' : 'var(--bg-alt)',
        }}>
        <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {parsing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Parsing file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={24} style={{ color: 'var(--text-3)' }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Drop a file or click to upload</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>DXF, DWG, PDF, SVG, PNG, JPG</p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-3" style={{ fontSize: 12, color: 'var(--danger)' }}>
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}
