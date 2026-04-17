import type { Template, DrawingSpec } from './types';

const fstSpec: DrawingSpec = {
  type: 'tank',
  unit: 'mm',
  views: [
    {
      id: 'plan',
      type: 'plan',
      label: 'PLAN VIEW',
      x: 80, y: 60, scale: 0.018,
      shapes: [
        { type: 'circle', cx: 400, cy: 300, r: 225, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2.5 },
        { type: 'circle', cx: 400, cy: 300, r: 213, fill: 'none', stroke: '#1a1a2e', strokeWidth: 1.5 },
        { type: 'circle', cx: 400, cy: 300, r: 15, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 2 },
        { type: 'rect', x: 395, y: 68, w: 10, h: 20, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
        { type: 'rect', x: 615, y: 293, w: 25, h: 14, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
        { type: 'line', x1: 400, y1: 300, x2: 580, y2: 200, stroke: '#64748b', strokeWidth: 1, dashed: true },
        { type: 'line', x1: 390, y1: 300, x2: 410, y2: 300, stroke: '#1a1a2e', strokeWidth: 0.5 },
        { type: 'line', x1: 400, y1: 290, x2: 400, y2: 310, stroke: '#1a1a2e', strokeWidth: 0.5 },
        // Section cut line A-A (BS 8888 Type G: chain with thickened ends)
        { type: 'line', x1: 160, y1: 300, x2: 640, y2: 300, stroke: '#dc2626', strokeWidth: 0.5, dashed: true },
        { type: 'line', x1: 140, y1: 300, x2: 165, y2: 300, stroke: '#dc2626', strokeWidth: 2 },
        { type: 'line', x1: 635, y1: 300, x2: 660, y2: 300, stroke: '#dc2626', strokeWidth: 2 },
        // Direction arrows (pointing down — looking at bottom half)
        { type: 'line', x1: 140, y1: 302, x2: 140, y2: 326, stroke: '#1a1a2e', strokeWidth: 2 },
        { type: 'line', x1: 660, y1: 302, x2: 660, y2: 326, stroke: '#1a1a2e', strokeWidth: 2 },
        { type: 'line', x1: 134, y1: 318, x2: 140, y2: 328, stroke: '#1a1a2e', strokeWidth: 1.5 },
        { type: 'line', x1: 146, y1: 318, x2: 140, y2: 328, stroke: '#1a1a2e', strokeWidth: 1.5 },
        { type: 'line', x1: 654, y1: 318, x2: 660, y2: 328, stroke: '#1a1a2e', strokeWidth: 1.5 },
        { type: 'line', x1: 666, y1: 318, x2: 660, y2: 328, stroke: '#1a1a2e', strokeWidth: 1.5 },
      ],
      dimensions: [
        { id: 'd1', type: 'diameter', x1: 175, y1: 300, x2: 625, y2: 300, offset: -260, text: 'Ø25,000', unit: 'mm' },
        { id: 'd2', type: 'linear', x1: 395, y1: 68, x2: 405, y2: 68, offset: -30, text: 'INLET DN300' },
        { id: 'd3', type: 'linear', x1: 615, y1: 293, x2: 640, y2: 293, offset: 30, text: 'OUTLET DN400' },
      ],
      labels: [
        { id: 'l1', x: 140, y: 345, text: 'A', fontSize: 16 },
        { id: 'l2', x: 660, y: 345, text: 'A', fontSize: 16 },
        { id: 'l3', x: 400, y: 570, text: 'PLAN VIEW', fontSize: 14 },
        { id: 'l4', x: 540, y: 220, text: 'SCRAPER ARM', fontSize: 9, leaderX: 490, leaderY: 250 },
        { id: 'l5', x: 400, y: 270, text: 'CENTRAL\nCOLUMN', fontSize: 8 },
      ],
    },
    {
      id: 'section',
      type: 'section',
      label: 'SECTION A-A',
      x: 80, y: 620, scale: 0.018,
      shapes: [
        { type: 'line', x1: 120, y1: 200, x2: 680, y2: 200, stroke: '#94a3b8', strokeWidth: 0.5, dashed: true },
        // Left wall (concrete fill — 45° hatching)
        { type: 'rect', x: 175, y: 100, w: 12, h: 200, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
        // Right wall
        { type: 'rect', x: 613, y: 100, w: 12, h: 200, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
        // Floor sloped left
        { type: 'polyline', points: [[187, 300], [187, 290], [395, 340], [395, 350]], fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2, closed: true },
        // Floor sloped right
        { type: 'polyline', points: [[613, 300], [613, 290], [405, 340], [405, 350]], fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2, closed: true },
        // Central sump
        { type: 'rect', x: 385, y: 340, w: 30, h: 25, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 2 },
        // Water level (BS 8888: chain line for levels)
        { type: 'line', x1: 187, y1: 140, x2: 613, y2: 140, stroke: '#3b82f6', strokeWidth: 0.8, dashed: true },
        // Top slab
        { type: 'line', x1: 187, y1: 100, x2: 613, y2: 100, stroke: '#1a1a2e', strokeWidth: 2 },
        // Central column
        { type: 'rect', x: 393, y: 80, w: 14, h: 270, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 1.5 },
      ],
      dimensions: [
        { id: 's1', type: 'linear', x1: 175, y1: 100, x2: 625, y2: 100, offset: -40, text: '25,000' },
        { id: 's2', type: 'linear', x1: 175, y1: 100, x2: 175, y2: 300, offset: -50, text: '2,000' },
        { id: 's3', type: 'linear', x1: 175, y1: 300, x2: 187, y2: 300, offset: 30, text: '250' },
        { id: 's4', type: 'linear', x1: 625, y1: 140, x2: 625, y2: 300, offset: 50, text: '1,600 (SWD)' },
        { id: 's5', type: 'linear', x1: 640, y1: 100, x2: 640, y2: 140, offset: 50, text: '400 (FB)' },
      ],
      labels: [
        { id: 'sl1', x: 400, y: 410, text: 'SECTION A-A', fontSize: 14 },
        { id: 'sl2', x: 400, y: 125, text: 'TWL', fontSize: 9, leaderX: 350, leaderY: 140 },
        { id: 'sl3', x: 320, y: 330, text: '7.5° FLOOR SLOPE', fontSize: 9 },
        { id: 'sl4', x: 400, y: 380, text: 'CENTRAL SUMP', fontSize: 8 },
      ],
    },
  ],
  titleBlock: {
    title: 'FINAL SETTLEMENT TANK (FST)',
    drawingNo: 'FST-001-GA',
    revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI',
    scale: '1:500',
    project: 'WASTEWATER TREATMENT WORKS',
  },
};

// 2. Rectangular Aeration Basin
const rectBasinSpec: DrawingSpec = {
  type: 'basin',
  unit: 'mm',
  views: [{
    id: 'plan', type: 'plan', label: 'PLAN VIEW', x: 80, y: 60, scale: 0.025,
    shapes: [
      { type: 'rect', x: 150, y: 150, w: 500, h: 266, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2.5 },
      { type: 'rect', x: 160, y: 160, w: 480, h: 246, fill: 'none', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'line', x1: 310, y1: 160, x2: 310, y2: 360, stroke: '#1a1a2e', strokeWidth: 1.5 },
      { type: 'line', x1: 490, y1: 160, x2: 490, y2: 360, stroke: '#1a1a2e', strokeWidth: 1.5 },
      { type: 'rect', x: 145, y: 270, w: 15, h: 20, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
      { type: 'rect', x: 650, y: 270, w: 15, h: 20, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
    ],
    dimensions: [
      { id: 'b1', type: 'linear', x1: 150, y1: 150, x2: 650, y2: 150, offset: -40, text: '15,000' },
      { id: 'b2', type: 'linear', x1: 150, y1: 150, x2: 150, y2: 416, offset: -40, text: '8,000' },
    ],
    labels: [
      { id: 'bl1', x: 400, y: 480, text: 'PLAN VIEW', fontSize: 14 },
      { id: 'bl2', x: 230, y: 260, text: 'ZONE 1', fontSize: 10 },
      { id: 'bl3', x: 400, y: 260, text: 'ZONE 2', fontSize: 10 },
      { id: 'bl4', x: 570, y: 260, text: 'ZONE 3', fontSize: 10 },
    ],
  }],
  titleBlock: {
    title: 'RECTANGULAR AERATION BASIN',
    drawingNo: 'RAB-001-GA', revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI', scale: '1:200', project: 'WASTEWATER TREATMENT WORKS',
  },
};

// 3. Pipe Cross-Section
const pipeSectionSpec: DrawingSpec = {
  type: 'pipe',
  unit: 'mm',
  views: [{
    id: 'section', type: 'section', label: 'PIPE CROSS-SECTION', x: 150, y: 80, scale: 0.5,
    shapes: [
      { type: 'circle', cx: 400, cy: 300, r: 180, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2.5 },
      { type: 'circle', cx: 400, cy: 300, r: 150, fill: '#ffffff', stroke: '#1a1a2e', strokeWidth: 2 },
      { type: 'line', x1: 400, y1: 295, x2: 400, y2: 305, stroke: '#1a1a2e', strokeWidth: 0.5 },
      { type: 'line', x1: 395, y1: 300, x2: 405, y2: 300, stroke: '#1a1a2e', strokeWidth: 0.5 },
    ],
    dimensions: [
      { id: 'p1', type: 'diameter', x1: 220, y1: 300, x2: 580, y2: 300, offset: -220, text: 'Ø600 (ID)' },
      { id: 'p2', type: 'linear', x1: 550, y1: 300, x2: 580, y2: 300, offset: 40, text: '30 (WALL)' },
    ],
    labels: [
      { id: 'pl1', x: 400, y: 530, text: 'PIPE CROSS-SECTION', fontSize: 14 },
      { id: 'pl2', x: 400, y: 300, text: 'DN600 RC PIPE', fontSize: 10 },
    ],
  }],
  titleBlock: {
    title: 'DN600 RC PIPE - CROSS SECTION',
    drawingNo: 'PIP-001-DET', revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI', scale: '1:10', project: 'PIPELINE WORKS',
  },
};

// 4. Steel I-Beam Detail
const steelBeamSpec: DrawingSpec = {
  type: 'beam',
  unit: 'mm',
  views: [{
    id: 'section', type: 'section', label: 'BEAM CROSS-SECTION', x: 100, y: 60, scale: 0.8,
    shapes: [
      // Top flange
      { type: 'rect', x: 300, y: 120, w: 200, h: 18, fill: 'url(#hatch-steel)', stroke: '#1a1a2e', strokeWidth: 2 },
      // Bottom flange
      { type: 'rect', x: 300, y: 462, w: 200, h: 18, fill: 'url(#hatch-steel)', stroke: '#1a1a2e', strokeWidth: 2 },
      // Web
      { type: 'rect', x: 392, y: 138, w: 16, h: 324, fill: 'url(#hatch-steel)', stroke: '#1a1a2e', strokeWidth: 1.5 },
      // Fillet radii (simplified as small lines)
      { type: 'line', x1: 392, y1: 138, x2: 384, y2: 146, stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'line', x1: 408, y1: 138, x2: 416, y2: 146, stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'line', x1: 392, y1: 462, x2: 384, y2: 454, stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'line', x1: 408, y1: 462, x2: 416, y2: 454, stroke: '#1a1a2e', strokeWidth: 1 },
      // Center lines
      { type: 'line', x1: 400, y1: 100, x2: 400, y2: 500, stroke: '#dc2626', strokeWidth: 0.3, dashed: true },
      { type: 'line', x1: 270, y1: 300, x2: 530, y2: 300, stroke: '#dc2626', strokeWidth: 0.3, dashed: true },
    ],
    dimensions: [
      { id: 'ib1', type: 'linear', x1: 300, y1: 120, x2: 500, y2: 120, offset: -30, text: '200' },
      { id: 'ib2', type: 'linear', x1: 520, y1: 120, x2: 520, y2: 480, offset: 40, text: '360' },
      { id: 'ib3', type: 'linear', x1: 392, y1: 500, x2: 408, y2: 500, offset: 30, text: '16' },
      { id: 'ib4', type: 'linear', x1: 280, y1: 120, x2: 280, y2: 138, offset: -30, text: '18' },
    ],
    labels: [
      { id: 'ibl1', x: 400, y: 550, text: 'UB 356x171x67', fontSize: 14 },
      { id: 'ibl2', x: 400, y: 60, text: 'STEEL I-BEAM CROSS-SECTION', fontSize: 12 },
      { id: 'ibl3', x: 460, y: 300, text: 'WEB', fontSize: 8 },
      { id: 'ibl4', x: 400, y: 108, text: 'TOP FLANGE', fontSize: 8 },
      { id: 'ibl5', x: 400, y: 498, text: 'BTM FLANGE', fontSize: 8 },
      { id: 'ibl6', x: 260, y: 165, text: 'S355', fontSize: 7 },
      { id: 'ibl7', x: 530, y: 300, text: 'GRADE S355 JR', fontSize: 7 },
    ],
  }],
  titleBlock: {
    title: 'STEEL I-BEAM UB 356x171x67',
    drawingNo: 'STL-001-DET', revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI', scale: '1:5', project: 'STRUCTURAL STEEL',
  },
};

// 5. Manhole Chamber Detail
const manholeSpec: DrawingSpec = {
  type: 'custom',
  unit: 'mm',
  views: [
    {
      id: 'plan', type: 'plan', label: 'PLAN VIEW', x: 60, y: 40, scale: 0.1,
      shapes: [
        // Outer chamber wall
        { type: 'circle', cx: 400, cy: 280, r: 160, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2.5 },
        // Inner chamber
        { type: 'circle', cx: 400, cy: 280, r: 145, fill: 'none', stroke: '#1a1a2e', strokeWidth: 1 },
        // Cover (reduced opening)
        { type: 'circle', cx: 400, cy: 280, r: 60, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2 },
        // Cover frame
        { type: 'circle', cx: 400, cy: 280, r: 55, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1 },
        // Inlet pipe
        { type: 'rect', x: 230, y: 273, w: 15, h: 14, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
        // Outlet pipe
        { type: 'rect', x: 555, y: 273, w: 15, h: 14, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
        // Step irons (4)
        { type: 'circle', cx: 420, cy: 240, r: 4, fill: '#64748b', stroke: '#1a1a2e', strokeWidth: 1 },
        { type: 'circle', cx: 420, cy: 260, r: 4, fill: '#64748b', stroke: '#1a1a2e', strokeWidth: 1 },
        { type: 'circle', cx: 420, cy: 300, r: 4, fill: '#64748b', stroke: '#1a1a2e', strokeWidth: 1 },
        { type: 'circle', cx: 420, cy: 320, r: 4, fill: '#64748b', stroke: '#1a1a2e', strokeWidth: 1 },
        // Benching flow channel
        { type: 'line', x1: 245, y1: 280, x2: 555, y2: 280, stroke: '#3b82f6', strokeWidth: 1.5 },
      ],
      dimensions: [
        { id: 'mh1', type: 'diameter', x1: 240, y1: 280, x2: 560, y2: 280, offset: -200, text: 'Ø1200 CHAMBER' },
        { id: 'mh2', type: 'diameter', x1: 340, y1: 280, x2: 460, y2: 280, offset: 160, text: 'Ø600 COVER' },
      ],
      labels: [
        { id: 'mhl1', x: 400, y: 500, text: 'PLAN VIEW', fontSize: 14 },
        { id: 'mhl2', x: 222, y: 260, text: 'INLET\nDN150', fontSize: 7 },
        { id: 'mhl3', x: 580, y: 260, text: 'OUTLET\nDN150', fontSize: 7 },
        { id: 'mhl4', x: 445, y: 280, text: 'STEP IRONS', fontSize: 7 },
      ],
    },
    {
      id: 'section', type: 'section', label: 'SECTION A-A', x: 60, y: 540, scale: 0.1,
      shapes: [
        // Ground level
        { type: 'line', x1: 200, y1: 100, x2: 600, y2: 100, stroke: '#94a3b8', strokeWidth: 1, dashed: true },
        // Cover frame
        { type: 'rect', x: 370, y: 92, w: 60, h: 12, fill: '#64748b', stroke: '#1a1a2e', strokeWidth: 2 },
        // Cone / reducing section
        { type: 'polyline', points: [[280, 130], [370, 104], [370, 130]], fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2, closed: true },
        { type: 'polyline', points: [[520, 130], [430, 104], [430, 130]], fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2, closed: true },
        // Left wall
        { type: 'rect', x: 268, y: 130, w: 12, h: 200, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
        // Right wall
        { type: 'rect', x: 520, y: 130, w: 12, h: 200, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
        // Base slab
        { type: 'rect', x: 268, y: 330, w: 264, h: 20, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
        // Benching
        { type: 'polyline', points: [[280, 330], [280, 290], [360, 280], [360, 330]], fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5, closed: true },
        { type: 'polyline', points: [[520, 330], [520, 290], [440, 280], [440, 330]], fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5, closed: true },
        // Channel
        { type: 'rect', x: 360, y: 280, w: 80, h: 50, fill: '#bfdbfe', stroke: '#1a1a2e', strokeWidth: 1 },
        // Step irons
        { type: 'line', x1: 410, y1: 140, x2: 430, y2: 140, stroke: '#64748b', strokeWidth: 3 },
        { type: 'line', x1: 410, y1: 180, x2: 430, y2: 180, stroke: '#64748b', strokeWidth: 3 },
        { type: 'line', x1: 410, y1: 220, x2: 430, y2: 220, stroke: '#64748b', strokeWidth: 3 },
        { type: 'line', x1: 410, y1: 260, x2: 430, y2: 260, stroke: '#64748b', strokeWidth: 3 },
      ],
      dimensions: [
        { id: 'ms1', type: 'linear', x1: 240, y1: 100, x2: 240, y2: 350, offset: -30, text: '2,100 DEPTH' },
        { id: 'ms2', type: 'linear', x1: 268, y1: 370, x2: 532, y2: 370, offset: 20, text: '1,200' },
        { id: 'ms3', type: 'linear', x1: 268, y1: 330, x2: 268, y2: 350, offset: -20, text: '150 BASE' },
      ],
      labels: [
        { id: 'msl1', x: 400, y: 410, text: 'SECTION A-A', fontSize: 14 },
        { id: 'msl2', x: 400, y: 310, text: 'CHANNEL', fontSize: 7 },
        { id: 'msl3', x: 315, y: 310, text: 'BENCHING', fontSize: 7 },
        { id: 'msl4', x: 200, y: 100, text: 'GL', fontSize: 9 },
      ],
    },
  ],
  titleBlock: {
    title: '1200mm DIA. INSPECTION CHAMBER',
    drawingNo: 'MH-001-GA', revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI', scale: '1:25', project: 'DRAINAGE WORKS',
  },
};

// 6. Reinforced Concrete Retaining Wall
const retainingWallSpec: DrawingSpec = {
  type: 'foundation',
  unit: 'mm',
  views: [{
    id: 'section', type: 'section', label: 'TYPICAL SECTION', x: 80, y: 60, scale: 0.05,
    shapes: [
      // Stem
      { type: 'polyline', points: [[340, 100], [360, 100], [370, 420], [330, 420]], fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2, closed: true },
      // Base slab (toe + heel)
      { type: 'rect', x: 200, y: 420, w: 400, h: 40, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
      // Key
      { type: 'rect', x: 320, y: 460, w: 40, h: 30, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 1.5 },
      // Ground behind wall (retained earth)
      { type: 'polyline', points: [[360, 100], [700, 100], [700, 420], [370, 420]], fill: 'none', stroke: '#94a3b8', strokeWidth: 0.5, dashed: true, closed: false },
      // Earth hatch lines
      { type: 'line', x1: 380, y1: 120, x2: 400, y2: 140, stroke: '#94a3b8', strokeWidth: 0.4 },
      { type: 'line', x1: 380, y1: 160, x2: 400, y2: 180, stroke: '#94a3b8', strokeWidth: 0.4 },
      { type: 'line', x1: 380, y1: 200, x2: 400, y2: 220, stroke: '#94a3b8', strokeWidth: 0.4 },
      { type: 'line', x1: 380, y1: 240, x2: 400, y2: 260, stroke: '#94a3b8', strokeWidth: 0.4 },
      { type: 'line', x1: 380, y1: 280, x2: 400, y2: 300, stroke: '#94a3b8', strokeWidth: 0.4 },
      { type: 'line', x1: 380, y1: 320, x2: 400, y2: 340, stroke: '#94a3b8', strokeWidth: 0.4 },
      { type: 'line', x1: 380, y1: 360, x2: 400, y2: 380, stroke: '#94a3b8', strokeWidth: 0.4 },
      // Ground level line
      { type: 'line', x1: 100, y1: 420, x2: 200, y2: 420, stroke: '#94a3b8', strokeWidth: 1, dashed: true },
      // Rebar indicators
      { type: 'circle', cx: 345, cy: 120, r: 3, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 355, cy: 120, r: 3, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 345, cy: 200, r: 3, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 355, cy: 200, r: 3, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 345, cy: 300, r: 3, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 355, cy: 300, r: 3, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      // Drainage layer
      { type: 'line', x1: 366, y1: 140, x2: 366, y2: 410, stroke: '#3b82f6', strokeWidth: 1, dashed: true },
    ],
    dimensions: [
      { id: 'rw1', type: 'linear', x1: 160, y1: 100, x2: 160, y2: 460, offset: -30, text: '3,600 OVERALL' },
      { id: 'rw2', type: 'linear', x1: 340, y1: 80, x2: 360, y2: 80, offset: -20, text: '300 TOP' },
      { id: 'rw3', type: 'linear', x1: 200, y1: 490, x2: 600, y2: 490, offset: 20, text: '2,400 BASE' },
      { id: 'rw4', type: 'linear', x1: 620, y1: 420, x2: 620, y2: 460, offset: 20, text: '400 SLAB' },
      { id: 'rw5', type: 'linear', x1: 200, y1: 510, x2: 330, y2: 510, offset: 20, text: '800 TOE' },
      { id: 'rw6', type: 'linear', x1: 370, y1: 510, x2: 600, y2: 510, offset: 20, text: '1,300 HEEL' },
    ],
    labels: [
      { id: 'rwl1', x: 350, y: 550, text: 'TYPICAL RETAINING WALL SECTION', fontSize: 14 },
      { id: 'rwl2', x: 350, y: 250, text: 'STEM', fontSize: 9 },
      { id: 'rwl3', x: 250, y: 440, text: 'TOE', fontSize: 9 },
      { id: 'rwl4', x: 480, y: 440, text: 'HEEL', fontSize: 9 },
      { id: 'rwl5', x: 340, y: 480, text: 'KEY', fontSize: 7 },
      { id: 'rwl6', x: 500, y: 250, text: 'RETAINED\nEARTH', fontSize: 9 },
      { id: 'rwl7', x: 375, y: 280, text: 'DRAINAGE', fontSize: 7 },
      { id: 'rwl8', x: 350, y: 115, text: 'T16@150', fontSize: 7 },
    ],
  }],
  titleBlock: {
    title: 'RC CANTILEVER RETAINING WALL',
    drawingNo: 'RW-001-DET', revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI', scale: '1:50', project: 'EARTHWORKS',
  },
};

// 7. Pump Station Wet Well
const pumpStationSpec: DrawingSpec = {
  type: 'tank',
  unit: 'mm',
  views: [{
    id: 'section', type: 'section', label: 'SECTION', x: 80, y: 60, scale: 0.04,
    shapes: [
      // Ground line
      { type: 'line', x1: 100, y1: 120, x2: 700, y2: 120, stroke: '#94a3b8', strokeWidth: 1, dashed: true },
      // Left wall
      { type: 'rect', x: 200, y: 100, w: 15, h: 360, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
      // Right wall
      { type: 'rect', x: 585, y: 100, w: 15, h: 360, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
      // Base slab
      { type: 'rect', x: 200, y: 440, w: 400, h: 20, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
      // Top slab with hatches
      { type: 'rect', x: 200, y: 100, w: 400, h: 15, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
      // Access hatch
      { type: 'rect', x: 360, y: 95, w: 80, h: 20, fill: '#64748b', stroke: '#1a1a2e', strokeWidth: 2 },
      // High water level
      { type: 'line', x1: 215, y1: 200, x2: 585, y2: 200, stroke: '#3b82f6', strokeWidth: 1, dashed: true },
      // Low water level
      { type: 'line', x1: 215, y1: 360, x2: 585, y2: 360, stroke: '#3b82f6', strokeWidth: 1, dashed: true },
      // Pump 1
      { type: 'circle', cx: 310, cy: 410, r: 20, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 2 },
      // Pump 2 (duty/standby)
      { type: 'circle', cx: 490, cy: 410, r: 20, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 2 },
      // Rising mains
      { type: 'line', x1: 310, y1: 390, x2: 310, y2: 100, stroke: '#1a1a2e', strokeWidth: 1.5 },
      { type: 'line', x1: 490, y1: 390, x2: 490, y2: 100, stroke: '#1a1a2e', strokeWidth: 1.5 },
      // Inlet pipe
      { type: 'rect', x: 188, y: 280, w: 25, h: 15, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
      // Guide rails
      { type: 'line', x1: 295, y1: 115, x2: 295, y2: 440, stroke: '#64748b', strokeWidth: 0.5 },
      { type: 'line', x1: 325, y1: 115, x2: 325, y2: 440, stroke: '#64748b', strokeWidth: 0.5 },
      { type: 'line', x1: 475, y1: 115, x2: 475, y2: 440, stroke: '#64748b', strokeWidth: 0.5 },
      { type: 'line', x1: 505, y1: 115, x2: 505, y2: 440, stroke: '#64748b', strokeWidth: 0.5 },
    ],
    dimensions: [
      { id: 'ps1', type: 'linear', x1: 200, y1: 100, x2: 600, y2: 100, offset: -30, text: '3,000' },
      { id: 'ps2', type: 'linear', x1: 170, y1: 100, x2: 170, y2: 460, offset: -30, text: '5,000 DEPTH' },
      { id: 'ps3', type: 'linear', x1: 620, y1: 200, x2: 620, y2: 360, offset: 30, text: 'WORKING\nVOLUME' },
      { id: 'ps4', type: 'linear', x1: 620, y1: 360, x2: 620, y2: 440, offset: 30, text: 'SUMP' },
    ],
    labels: [
      { id: 'psl1', x: 400, y: 510, text: 'PUMP STATION WET WELL - SECTION', fontSize: 14 },
      { id: 'psl2', x: 580, y: 190, text: 'HWL', fontSize: 8 },
      { id: 'psl3', x: 580, y: 350, text: 'LWL', fontSize: 8 },
      { id: 'psl4', x: 310, y: 410, text: 'P1', fontSize: 9 },
      { id: 'psl5', x: 490, y: 410, text: 'P2', fontSize: 9 },
      { id: 'psl6', x: 170, y: 280, text: 'INLET\nDN225', fontSize: 7 },
      { id: 'psl7', x: 400, y: 88, text: 'ACCESS', fontSize: 7 },
      { id: 'psl8', x: 100, y: 120, text: 'GL', fontSize: 9 },
    ],
  }],
  titleBlock: {
    title: 'SEWAGE PUMP STATION - WET WELL',
    drawingNo: 'PS-001-GA', revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI', scale: '1:50', project: 'PUMPING STATION',
  },
};

// 8. Floor Plan - Small Office
const officeFloorPlanSpec: DrawingSpec = {
  type: 'custom',
  unit: 'mm',
  views: [{
    id: 'plan', type: 'plan', label: 'GROUND FLOOR PLAN', x: 40, y: 40, scale: 0.01,
    shapes: [
      // Outer walls
      { type: 'rect', x: 100, y: 100, w: 600, h: 400, fill: 'none', stroke: '#1a1a2e', strokeWidth: 3 },
      // Internal wall 1 (reception/office split)
      { type: 'line', x1: 350, y1: 100, x2: 350, y2: 350, stroke: '#1a1a2e', strokeWidth: 2 },
      // Internal wall 2 (meeting room)
      { type: 'line', x1: 350, y1: 350, x2: 700, y2: 350, stroke: '#1a1a2e', strokeWidth: 2 },
      // WC partition
      { type: 'line', x1: 100, y1: 350, x2: 220, y2: 350, stroke: '#1a1a2e', strokeWidth: 2 },
      { type: 'line', x1: 220, y1: 350, x2: 220, y2: 500, stroke: '#1a1a2e', strokeWidth: 2 },
      // Kitchen partition
      { type: 'line', x1: 220, y1: 350, x2: 350, y2: 350, stroke: '#1a1a2e', strokeWidth: 2 },
      // Front door — opening in wall + 90° swing arc
      { type: 'line', x1: 200, y1: 100, x2: 280, y2: 100, stroke: 'white', strokeWidth: 4 }, // gap in wall
      { type: 'line', x1: 200, y1: 100, x2: 200, y2: 180, stroke: '#1a1a2e', strokeWidth: 1 }, // door leaf
      { type: 'arc', cx: 200, cy: 100, r: 80, startAngle: 270, endAngle: 360, stroke: '#1a1a2e', strokeWidth: 0.5 }, // swing arc
      // Internal door — reception to office
      { type: 'line', x1: 350, y1: 200, x2: 350, y2: 250, stroke: 'white', strokeWidth: 4 },
      { type: 'line', x1: 350, y1: 200, x2: 400, y2: 200, stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'arc', cx: 350, cy: 200, r: 50, startAngle: 0, endAngle: 90, stroke: '#1a1a2e', strokeWidth: 0.5 },
      // Meeting room door
      { type: 'line', x1: 500, y1: 350, x2: 560, y2: 350, stroke: 'white', strokeWidth: 4 },
      { type: 'line', x1: 500, y1: 350, x2: 500, y2: 400, stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'arc', cx: 500, cy: 350, r: 50, startAngle: 270, endAngle: 360, stroke: '#1a1a2e', strokeWidth: 0.5 },
      // WC door
      { type: 'line', x1: 150, y1: 350, x2: 190, y2: 350, stroke: 'white', strokeWidth: 4 },
      { type: 'line', x1: 190, y1: 350, x2: 190, y2: 390, stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'arc', cx: 190, cy: 350, r: 40, startAngle: 270, endAngle: 360, stroke: '#1a1a2e', strokeWidth: 0.5 },
      // Windows
      { type: 'line', x1: 100, y1: 180, x2: 100, y2: 280, stroke: '#3b82f6', strokeWidth: 4 },
      { type: 'line', x1: 450, y1: 100, x2: 600, y2: 100, stroke: '#3b82f6', strokeWidth: 4 },
      { type: 'line', x1: 700, y1: 200, x2: 700, y2: 320, stroke: '#3b82f6', strokeWidth: 4 },
      // Furniture - reception desk
      { type: 'rect', x: 150, y: 180, w: 80, h: 40, fill: '#f1f5f9', stroke: '#94a3b8', strokeWidth: 0.5 },
      // Furniture - office desks (2)
      { type: 'rect', x: 420, y: 160, w: 60, h: 30, fill: '#f1f5f9', stroke: '#94a3b8', strokeWidth: 0.5 },
      { type: 'rect', x: 560, y: 160, w: 60, h: 30, fill: '#f1f5f9', stroke: '#94a3b8', strokeWidth: 0.5 },
      // Meeting table
      { type: 'rect', x: 450, y: 390, w: 120, h: 60, fill: '#f1f5f9', stroke: '#94a3b8', strokeWidth: 0.5 },
      // WC fixtures
      { type: 'rect', x: 120, y: 420, w: 30, h: 20, fill: '#f1f5f9', stroke: '#94a3b8', strokeWidth: 0.5 },
      { type: 'rect', x: 120, y: 460, w: 20, h: 15, fill: '#f1f5f9', stroke: '#94a3b8', strokeWidth: 0.5 },
    ],
    dimensions: [
      { id: 'fp1', type: 'linear', x1: 100, y1: 100, x2: 700, y2: 100, offset: -30, text: '12,000' },
      { id: 'fp2', type: 'linear', x1: 100, y1: 100, x2: 100, y2: 500, offset: -30, text: '8,000' },
      { id: 'fp3', type: 'linear', x1: 100, y1: 520, x2: 350, y2: 520, offset: 20, text: '5,000' },
      { id: 'fp4', type: 'linear', x1: 350, y1: 520, x2: 700, y2: 520, offset: 20, text: '7,000' },
    ],
    labels: [
      { id: 'fpl1', x: 225, y: 220, text: 'RECEPTION', fontSize: 10 },
      { id: 'fpl2', x: 525, y: 220, text: 'OFFICE', fontSize: 10 },
      { id: 'fpl3', x: 525, y: 420, text: 'MEETING\nROOM', fontSize: 10 },
      { id: 'fpl4', x: 160, y: 420, text: 'WC', fontSize: 9 },
      { id: 'fpl5', x: 285, y: 420, text: 'KITCHEN', fontSize: 9 },
      { id: 'fpl6', x: 400, y: 560, text: 'GROUND FLOOR PLAN', fontSize: 14 },
    ],
  }],
  titleBlock: {
    title: 'SMALL OFFICE - GROUND FLOOR PLAN',
    drawingNo: 'ARC-001-GA', revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI', scale: '1:100', project: 'OFFICE FIT-OUT',
  },
};

// 9. Steel Connection Detail
const steelConnectionSpec: DrawingSpec = {
  type: 'custom',
  unit: 'mm',
  views: [{
    id: 'elevation', type: 'section', label: 'END PLATE CONNECTION', x: 100, y: 60, scale: 0.5,
    shapes: [
      // Column (UB section, simplified)
      { type: 'rect', x: 250, y: 80, w: 20, h: 440, fill: 'url(#hatch-steel)', stroke: '#1a1a2e', strokeWidth: 2 },
      { type: 'rect', x: 230, y: 80, w: 60, h: 12, fill: 'url(#hatch-steel)', stroke: '#1a1a2e', strokeWidth: 2 },
      { type: 'rect', x: 230, y: 508, w: 60, h: 12, fill: 'url(#hatch-steel)', stroke: '#1a1a2e', strokeWidth: 2 },
      // End plate
      { type: 'rect', x: 270, y: 200, w: 12, h: 200, fill: '#94a3b8', stroke: '#1a1a2e', strokeWidth: 2 },
      // Beam (I-section)
      { type: 'rect', x: 282, y: 210, w: 300, h: 12, fill: 'url(#hatch-steel)', stroke: '#1a1a2e', strokeWidth: 2 },
      { type: 'rect', x: 282, y: 378, w: 300, h: 12, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 2 },
      { type: 'rect', x: 282, y: 222, w: 10, h: 156, fill: 'url(#hatch-concrete)', stroke: '#1a1a2e', strokeWidth: 1.5 },
      // Bolts (6 total, 3 rows x 2)
      { type: 'circle', cx: 276, cy: 230, r: 5, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 276, cy: 270, r: 5, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 276, cy: 300, r: 5, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 276, cy: 330, r: 5, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 276, cy: 360, r: 5, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      { type: 'circle', cx: 276, cy: 380, r: 5, fill: '#1a1a2e', stroke: '#1a1a2e', strokeWidth: 1 },
      // Fillet weld symbols (BS 8888: right triangle, perpendicular leg on left)
      // Top flange weld — reference line + arrow + fillet triangle
      { type: 'line', x1: 288, y1: 218, x2: 340, y2: 218, stroke: '#1a1a2e', strokeWidth: 0.7 }, // reference line
      { type: 'line', x1: 288, y1: 218, x2: 285, y2: 222, stroke: '#1a1a2e', strokeWidth: 0.7 }, // arrow
      { type: 'polyline', points: [[300, 218], [300, 210], [310, 218]], fill: 'none', stroke: '#1a1a2e', strokeWidth: 0.8, closed: true }, // fillet triangle
      { type: 'text', x: 296, y: 208, text: '8', fontSize: 6, fill: '#1a1a2e' }, // weld size
      // Bottom flange weld
      { type: 'line', x1: 288, y1: 382, x2: 340, y2: 382, stroke: '#1a1a2e', strokeWidth: 0.7 },
      { type: 'line', x1: 288, y1: 382, x2: 285, y2: 378, stroke: '#1a1a2e', strokeWidth: 0.7 },
      { type: 'polyline', points: [[300, 382], [300, 374], [310, 382]], fill: 'none', stroke: '#1a1a2e', strokeWidth: 0.8, closed: true },
      { type: 'text', x: 296, y: 372, text: '8', fontSize: 6, fill: '#1a1a2e' },
    ],
    dimensions: [
      { id: 'sc1', type: 'linear', x1: 270, y1: 200, x2: 282, y2: 200, offset: -40, text: '12 E/P' },
      { id: 'sc2', type: 'linear', x1: 282, y1: 190, x2: 582, y2: 190, offset: -20, text: 'UB 305x165x40' },
      { id: 'sc3', type: 'linear', x1: 600, y1: 210, x2: 600, y2: 390, offset: 30, text: '180' },
      { id: 'sc4', type: 'linear', x1: 270, y1: 400, x2: 270, y2: 200, offset: -60, text: '200 E/P' },
    ],
    labels: [
      { id: 'scl1', x: 400, y: 480, text: 'BEAM-TO-COLUMN END PLATE CONNECTION', fontSize: 12 },
      { id: 'scl2', x: 260, y: 300, text: 'COLUMN\nUC 203x203', fontSize: 7 },
      { id: 'scl3', x: 440, y: 300, text: 'BEAM', fontSize: 9 },
      { id: 'scl4', x: 276, y: 246, text: '6No. M20\n8.8 BOLTS', fontSize: 7 },
      { id: 'scl5', x: 330, y: 208, text: '8mm FILLET WELD\n(BOTH FLANGES)', fontSize: 6 },
    ],
  }],
  titleBlock: {
    title: 'BEAM-COLUMN END PLATE CONNECTION',
    drawingNo: 'STL-002-DET', revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI', scale: '1:5', project: 'STRUCTURAL STEEL',
  },
};

// 10. Site Layout / Plot Plan
const sitePlanSpec: DrawingSpec = {
  type: 'custom',
  unit: 'mm',
  views: [{
    id: 'plan', type: 'plan', label: 'SITE LAYOUT', x: 40, y: 40, scale: 0.005,
    shapes: [
      // Site boundary
      { type: 'rect', x: 80, y: 80, w: 640, h: 440, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2, dashed: true },
      // Main building
      { type: 'rect', x: 200, y: 150, w: 300, h: 200, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 2.5 },
      // Parking area
      { type: 'rect', x: 550, y: 150, w: 140, h: 200, fill: 'none', stroke: '#1a1a2e', strokeWidth: 1 },
      // Parking bay lines
      { type: 'line', x1: 550, y1: 175, x2: 690, y2: 175, stroke: '#94a3b8', strokeWidth: 0.5 },
      { type: 'line', x1: 550, y1: 200, x2: 690, y2: 200, stroke: '#94a3b8', strokeWidth: 0.5 },
      { type: 'line', x1: 550, y1: 225, x2: 690, y2: 225, stroke: '#94a3b8', strokeWidth: 0.5 },
      { type: 'line', x1: 550, y1: 250, x2: 690, y2: 250, stroke: '#94a3b8', strokeWidth: 0.5 },
      { type: 'line', x1: 550, y1: 275, x2: 690, y2: 275, stroke: '#94a3b8', strokeWidth: 0.5 },
      { type: 'line', x1: 550, y1: 300, x2: 690, y2: 300, stroke: '#94a3b8', strokeWidth: 0.5 },
      { type: 'line', x1: 550, y1: 325, x2: 690, y2: 325, stroke: '#94a3b8', strokeWidth: 0.5 },
      // Access road
      { type: 'rect', x: 300, y: 350, w: 100, h: 170, fill: '#f1f5f9', stroke: '#1a1a2e', strokeWidth: 1 },
      // Entrance gate
      { type: 'line', x1: 300, y1: 500, x2: 400, y2: 500, stroke: '#3b82f6', strokeWidth: 3 },
      // Substation
      { type: 'rect', x: 120, y: 400, w: 50, h: 40, fill: '#fef3c7', stroke: '#1a1a2e', strokeWidth: 1.5 },
      // Bin store
      { type: 'rect', x: 120, y: 300, w: 40, h: 30, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1 },
      // Landscaping circles (trees)
      { type: 'circle', cx: 150, cy: 170, r: 15, fill: '#bbf7d0', stroke: '#22c55e', strokeWidth: 1 },
      { type: 'circle', cx: 150, cy: 220, r: 15, fill: '#bbf7d0', stroke: '#22c55e', strokeWidth: 1 },
      { type: 'circle', cx: 150, cy: 270, r: 15, fill: '#bbf7d0', stroke: '#22c55e', strokeWidth: 1 },
      { type: 'circle', cx: 570, cy: 420, r: 15, fill: '#bbf7d0', stroke: '#22c55e', strokeWidth: 1 },
      { type: 'circle', cx: 630, cy: 420, r: 15, fill: '#bbf7d0', stroke: '#22c55e', strokeWidth: 1 },
      // North arrow
      { type: 'line', x1: 680, y1: 100, x2: 680, y2: 60, stroke: '#1a1a2e', strokeWidth: 2 },
      { type: 'line', x1: 680, y1: 60, x2: 675, y2: 70, stroke: '#1a1a2e', strokeWidth: 2 },
      { type: 'line', x1: 680, y1: 60, x2: 685, y2: 70, stroke: '#1a1a2e', strokeWidth: 2 },
    ],
    dimensions: [
      { id: 'sp1', type: 'linear', x1: 80, y1: 80, x2: 720, y2: 80, offset: -25, text: '60,000' },
      { id: 'sp2', type: 'linear', x1: 80, y1: 80, x2: 80, y2: 520, offset: -25, text: '40,000' },
      { id: 'sp3', type: 'linear', x1: 200, y1: 370, x2: 500, y2: 370, offset: 20, text: '30,000' },
      { id: 'sp4', type: 'linear', x1: 200, y1: 390, x2: 200, y2: 150, offset: -20, text: '20,000' },
    ],
    labels: [
      { id: 'spl1', x: 350, y: 250, text: 'MAIN\nBUILDING', fontSize: 12 },
      { id: 'spl2', x: 620, y: 250, text: 'CAR\nPARK\n(8 spaces)', fontSize: 8 },
      { id: 'spl3', x: 350, y: 430, text: 'ACCESS\nROAD', fontSize: 8 },
      { id: 'spl4', x: 145, y: 420, text: 'SUBSTATION', fontSize: 6 },
      { id: 'spl5', x: 140, y: 320, text: 'BIN\nSTORE', fontSize: 6 },
      { id: 'spl6', x: 680, y: 52, text: 'N', fontSize: 12 },
      { id: 'spl7', x: 400, y: 560, text: 'SITE LAYOUT PLAN', fontSize: 14 },
      { id: 'spl8', x: 350, y: 510, text: 'ENTRANCE', fontSize: 8 },
    ],
  }],
  titleBlock: {
    title: 'PROPOSED SITE LAYOUT',
    drawingNo: 'SLP-001-GA', revision: 'P01',
    date: new Date().toISOString().split('T')[0],
    drawnBy: 'DrawSpec AI', scale: '1:500', project: 'COMMERCIAL DEVELOPMENT',
  },
};

export const templates: Template[] = [
  { id: 'fst', name: 'Final Settlement Tank (FST)', description: '25m diameter circular settlement tank with central column, scraper arm, inlet/outlet, 7.5° floor slope. Plan + Section A-A.', category: 'Water Treatment', thumbnail: '🏗️', spec: fstSpec },
  { id: 'rect-basin', name: 'Rectangular Aeration Basin', description: '15m × 8m rectangular aeration basin with 3 zones and baffles', category: 'Water Treatment', thumbnail: '🔲', spec: rectBasinSpec },
  { id: 'pipe-section', name: 'Pipe Cross-Section', description: 'DN600 reinforced concrete pipe with 30mm wall thickness', category: 'Pipework', thumbnail: '⭕', spec: pipeSectionSpec },
  { id: 'steel-beam', name: 'Steel I-Beam (UB 356×171×67)', description: 'Universal beam cross-section with flange/web dimensions, fillet radii, and center lines', category: 'Structural Steel', thumbnail: '🔩', spec: steelBeamSpec },
  { id: 'manhole', name: 'Inspection Chamber (1200mm)', description: '1200mm diameter manhole with 600mm cover, step irons, benching, inlet/outlet. Plan + Section.', category: 'Drainage', thumbnail: '🕳️', spec: manholeSpec },
  { id: 'retaining-wall', name: 'RC Cantilever Retaining Wall', description: 'Reinforced concrete cantilever retaining wall with toe, heel, key, and drainage', category: 'Civil/Structural', thumbnail: '🧱', spec: retainingWallSpec },
  { id: 'pump-station', name: 'Sewage Pump Station Wet Well', description: 'Below-ground wet well with duty/standby pumps, guide rails, rising mains, HWL/LWL', category: 'Water Treatment', thumbnail: '⚙️', spec: pumpStationSpec },
  { id: 'office-plan', name: 'Small Office Floor Plan', description: '12m × 8m office with reception, open office, meeting room, kitchen, WC. Furniture layout included.', category: 'Architecture', thumbnail: '🏢', spec: officeFloorPlanSpec },
  { id: 'steel-connection', name: 'Beam-Column End Plate', description: 'Bolted end plate connection: UB 305×165 beam to UC 203×203 column with 6No. M20 bolts', category: 'Structural Steel', thumbnail: '🔧', spec: steelConnectionSpec },
  { id: 'site-plan', name: 'Commercial Site Layout', description: '60m × 40m site with building, car park (8 spaces), access road, substation, landscaping, north arrow', category: 'Civil', thumbnail: '🗺️', spec: sitePlanSpec },
];
