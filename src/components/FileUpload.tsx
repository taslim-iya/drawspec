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
    // Convert image to base64 and send to AI for interpretation
    const base64 = await fileToBase64(file);
    await parseWithAI(file, file.name.split('.').pop() || 'image', base64);
  };

  const parsePDF = async (file: File) => {
    const base64 = await fileToBase64(file);
    await parseWithAI(file, 'pdf', base64);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const parseWithAI = async (file: File, format: string, base64?: string) => {
    // Send to AI for interpretation
    const localKey = localStorage.getItem('drawspec-openai-key') || '';
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `I've uploaded an engineering drawing file (${file.name}, format: ${format}). Describe what the drawing shows and provide structured dimensions. Respond with JSON containing: title, type (tank/basin/pipe/custom), dimensions (with keys like diameter, width, height, wall_thickness in mm), and features (array of strings describing key features). If you can identify specific measurements from the description, include them.`,
          apiKey: localKey,
          ...(base64 && ['png','jpg','jpeg'].includes(format) ? { imageBase64: base64 } : {}),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Try to parse AI response
      const content = data.choices?.[0]?.message?.content || data.content || '';
      const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || content.match(/\{[\s\S]*\}/);
      let parsed: any = {};
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]); } catch {}
      }

      const title = parsed.title || file.name.replace(/\.[^.]+$/, '').toUpperCase();
      const dims = parsed.dimensions || {};

      // Build shapes from parsed info
      const shapes: any[] = [];
      const labels: any[] = [{ id: 'lbl-title', x: 400, y: 30, text: title, fontSize: 14 }];
      const dimensions: any[] = [];

      if (parsed.type === 'tank' && dims.diameter) {
        const r = 200;
        shapes.push({ type: 'circle', cx: 400, cy: 300, r, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2.5 });
        dimensions.push({ id: 'dim-dia', type: 'linear', x1: 200, y1: 530, x2: 600, y2: 530, offset: 20, text: `Ø${dims.diameter}mm` });
      } else if (dims.width || dims.length) {
        const w = 500, h = 300;
        shapes.push({ type: 'rect', x: 150, y: 150, w, h, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2.5 });
        if (dims.width) dimensions.push({ id: 'dim-w', type: 'linear', x1: 150, y1: 470, x2: 650, y2: 470, offset: 20, text: `${dims.width}mm` });
        if (dims.height) dimensions.push({ id: 'dim-h', type: 'linear', x1: 670, y1: 150, x2: 670, y2: 450, offset: 20, text: `${dims.height}mm` });
      } else {
        shapes.push({ type: 'rect', x: 100, y: 100, w: 600, h: 400, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2 });
        labels.push({ id: 'lbl-desc', x: 400, y: 300, text: `Imported from ${file.name}`, fontSize: 11 });
      }

      // Add features as labels
      (parsed.features || []).forEach((f: string, i: number) => {
        labels.push({ id: `feat-${i}`, x: 100, y: 580 + i * 16, text: `${i + 1}. ${f}`, fontSize: 9 });
      });

      const spec = {
        type: (parsed.type || 'custom') as any,
        unit: 'mm' as const,
        views: [{
          id: 'ai-parsed',
          type: 'plan' as const,
          label: `${format.toUpperCase()}: ${file.name}`,
          x: 40, y: 40, scale: 1,
          shapes, dimensions, labels,
        }],
        titleBlock: {
          title, drawingNo: 'UPL-001', revision: 'P01',
          date: new Date().toISOString().split('T')[0],
          drawnBy: 'AI Import', scale: 'NTS', project: 'UPLOADED DRAWING',
        },
      };
      onParsed(spec, file.name);
    } catch {
      // Fallback to placeholder if AI fails
      const spec = {
        type: 'custom' as const,
        unit: 'mm' as const,
        views: [{
          id: 'ai-parsed', type: 'plan' as const,
          label: `${format.toUpperCase()}: ${file.name}`,
          x: 40, y: 40, scale: 1,
          shapes: [
            { type: 'text' as const, x: 400, y: 280, text: `Uploaded: ${file.name}`, fontSize: 14, fill: '#1a1a2e' },
            { type: 'text' as const, x: 400, y: 310, text: 'AI parsing failed — use chat to describe the drawing', fontSize: 10, fill: '#64748b' },
            { type: 'rect' as const, x: 150, y: 150, w: 500, h: 300, fill: 'none', stroke: '#d1d5db', strokeWidth: 1 },
          ],
          dimensions: [], labels: [],
        }],
        titleBlock: {
          title: file.name.replace(/\.[^.]+$/, '').toUpperCase(),
          drawingNo: 'UPL-001', revision: 'P01',
          date: new Date().toISOString().split('T')[0],
          drawnBy: 'Upload', scale: 'NTS', project: 'UPLOADED DRAWING',
        },
      };
      onParsed(spec, file.name);
    }
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
