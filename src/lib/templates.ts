import type { Template, DrawingSpec } from './types';

const fstSpec: DrawingSpec = {
  type: 'tank',
  unit: 'mm',
  views: [
    {
      id: 'plan',
      type: 'plan',
      label: 'PLAN VIEW',
      x: 80,
      y: 60,
      scale: 0.018,
      shapes: [
        // Outer wall
        { type: 'circle', cx: 400, cy: 300, r: 225, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2.5 },
        // Inner wall
        { type: 'circle', cx: 400, cy: 300, r: 213, fill: 'none', stroke: '#1a1a2e', strokeWidth: 1.5 },
        // Central column
        { type: 'circle', cx: 400, cy: 300, r: 15, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 2 },
        // Inlet pipe
        { type: 'rect', x: 395, y: 68, w: 10, h: 20, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
        // Outlet channel
        { type: 'rect', x: 615, y: 293, w: 25, h: 14, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
        // Scraper arm
        { type: 'line', x1: 400, y1: 300, x2: 580, y2: 200, stroke: '#64748b', strokeWidth: 1, dashed: true },
        // Cross-hairs (center marks)
        { type: 'line', x1: 390, y1: 300, x2: 410, y2: 300, stroke: '#1a1a2e', strokeWidth: 0.5 },
        { type: 'line', x1: 400, y1: 290, x2: 400, y2: 310, stroke: '#1a1a2e', strokeWidth: 0.5 },
        // Section cut line A-A
        { type: 'line', x1: 140, y1: 300, x2: 660, y2: 300, stroke: '#dc2626', strokeWidth: 1.5, dashed: true },
      ],
      dimensions: [
        { id: 'd1', type: 'diameter', x1: 175, y1: 300, x2: 625, y2: 300, offset: -260, text: 'Ø25,000', unit: 'mm' },
        { id: 'd2', type: 'linear', x1: 395, y1: 68, x2: 405, y2: 68, offset: -30, text: 'INLET DN300' },
        { id: 'd3', type: 'linear', x1: 615, y1: 293, x2: 640, y2: 293, offset: 30, text: 'OUTLET DN400' },
      ],
      labels: [
        { id: 'l1', x: 130, y: 300, text: 'A', fontSize: 18 },
        { id: 'l2', x: 670, y: 300, text: 'A', fontSize: 18 },
        { id: 'l3', x: 400, y: 570, text: 'PLAN VIEW', fontSize: 14 },
        { id: 'l4', x: 540, y: 220, text: 'SCRAPER ARM', fontSize: 9, leaderX: 490, leaderY: 250 },
        { id: 'l5', x: 400, y: 270, text: 'CENTRAL\nCOLUMN', fontSize: 8 },
      ],
    },
    {
      id: 'section',
      type: 'section',
      label: 'SECTION A-A',
      x: 80,
      y: 620,
      scale: 0.018,
      shapes: [
        // Ground line
        { type: 'line', x1: 120, y1: 200, x2: 680, y2: 200, stroke: '#94a3b8', strokeWidth: 0.5, dashed: true },
        // Left wall outer
        { type: 'rect', x: 175, y: 100, w: 12, h: 200, fill: '#d1d5db', stroke: '#1a1a2e', strokeWidth: 2 },
        // Right wall outer
        { type: 'rect', x: 613, y: 100, w: 12, h: 200, fill: '#d1d5db', stroke: '#1a1a2e', strokeWidth: 2 },
        // Floor - sloped left side
        { type: 'polyline', points: [[187, 300], [187, 290], [395, 340], [395, 350]], fill: '#d1d5db', stroke: '#1a1a2e', strokeWidth: 2, closed: true },
        // Floor - sloped right side
        { type: 'polyline', points: [[613, 300], [613, 290], [405, 340], [405, 350]], fill: '#d1d5db', stroke: '#1a1a2e', strokeWidth: 2, closed: true },
        // Central sump
        { type: 'rect', x: 385, y: 340, w: 30, h: 25, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 2 },
        // Water level
        { type: 'line', x1: 187, y1: 140, x2: 613, y2: 140, stroke: '#3b82f6', strokeWidth: 1, dashed: true },
        // Freeboard arrows
        { type: 'line', x1: 187, y1: 100, x2: 613, y2: 100, stroke: '#1a1a2e', strokeWidth: 2 },
        // Central column
        { type: 'rect', x: 393, y: 80, w: 14, h: 270, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
        // Hatching on walls (simplified)
        { type: 'line', x1: 175, y1: 110, x2: 187, y2: 100, stroke: '#94a3b8', strokeWidth: 0.5 },
        { type: 'line', x1: 175, y1: 140, x2: 187, y2: 130, stroke: '#94a3b8', strokeWidth: 0.5 },
        { type: 'line', x1: 175, y1: 170, x2: 187, y2: 160, stroke: '#94a3b8', strokeWidth: 0.5 },
        { type: 'line', x1: 175, y1: 200, x2: 187, y2: 190, stroke: '#94a3b8', strokeWidth: 0.5 },
        { type: 'line', x1: 175, y1: 230, x2: 187, y2: 220, stroke: '#94a3b8', strokeWidth: 0.5 },
        { type: 'line', x1: 175, y1: 260, x2: 187, y2: 250, stroke: '#94a3b8', strokeWidth: 0.5 },
        { type: 'line', x1: 175, y1: 290, x2: 187, y2: 280, stroke: '#94a3b8', strokeWidth: 0.5 },
      ],
      dimensions: [
        // Overall diameter
        { id: 's1', type: 'linear', x1: 175, y1: 100, x2: 625, y2: 100, offset: -40, text: '25,000' },
        // Sidewall height
        { id: 's2', type: 'linear', x1: 175, y1: 100, x2: 175, y2: 300, offset: -50, text: '2,000' },
        // Wall thickness
        { id: 's3', type: 'linear', x1: 175, y1: 300, x2: 187, y2: 300, offset: 30, text: '250' },
        // Water depth
        { id: 's4', type: 'linear', x1: 625, y1: 140, x2: 625, y2: 300, offset: 50, text: '1,600 (SWD)' },
        // Freeboard
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

export const templates: Template[] = [
  {
    id: 'fst',
    name: 'Final Settlement Tank (FST)',
    description: '25m diameter circular settlement tank with central column, scraper arm, inlet/outlet, 7.5° floor slope',
    category: 'Water Treatment',
    thumbnail: '🏗️',
    spec: fstSpec,
  },
  {
    id: 'rect-basin',
    name: 'Rectangular Concrete Basin',
    description: '15m × 8m rectangular aeration basin with baffles',
    category: 'Water Treatment',
    thumbnail: '🔲',
    spec: {
      type: 'basin',
      unit: 'mm',
      views: [
        {
          id: 'plan',
          type: 'plan',
          label: 'PLAN VIEW',
          x: 80,
          y: 60,
          scale: 0.025,
          shapes: [
            { type: 'rect', x: 150, y: 150, w: 500, h: 266, fill: 'none', stroke: '#1a1a2e', strokeWidth: 2.5 },
            { type: 'rect', x: 160, y: 160, w: 480, h: 246, fill: 'none', stroke: '#1a1a2e', strokeWidth: 1 },
            // Baffles
            { type: 'line', x1: 310, y1: 160, x2: 310, y2: 360, stroke: '#1a1a2e', strokeWidth: 1.5 },
            { type: 'line', x1: 490, y1: 160, x2: 490, y2: 360, stroke: '#1a1a2e', strokeWidth: 1.5 },
            // Inlet
            { type: 'rect', x: 145, y: 270, w: 15, h: 20, fill: '#e2e8f0', stroke: '#1a1a2e', strokeWidth: 1.5 },
            // Outlet
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
        },
      ],
      titleBlock: {
        title: 'RECTANGULAR AERATION BASIN',
        drawingNo: 'RAB-001-GA',
        revision: 'P01',
        date: new Date().toISOString().split('T')[0],
        drawnBy: 'DrawSpec AI',
        scale: '1:200',
        project: 'WASTEWATER TREATMENT WORKS',
      },
    },
  },
  {
    id: 'pipe-section',
    name: 'Pipe Cross-Section',
    description: 'DN600 reinforced concrete pipe cross-section detail',
    category: 'Pipework',
    thumbnail: '⭕',
    spec: {
      type: 'pipe',
      unit: 'mm',
      views: [
        {
          id: 'section',
          type: 'section',
          label: 'PIPE CROSS-SECTION',
          x: 150,
          y: 80,
          scale: 0.5,
          shapes: [
            { type: 'circle', cx: 400, cy: 300, r: 180, fill: '#d1d5db', stroke: '#1a1a2e', strokeWidth: 2.5 },
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
        },
      ],
      titleBlock: {
        title: 'DN600 RC PIPE - CROSS SECTION',
        drawingNo: 'PIP-001-DET',
        revision: 'P01',
        date: new Date().toISOString().split('T')[0],
        drawnBy: 'DrawSpec AI',
        scale: '1:10',
        project: 'PIPELINE WORKS',
      },
    },
  },
];
