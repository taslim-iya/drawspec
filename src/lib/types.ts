export interface Drawing {
  id: string;
  name: string;
  description: string;
  spec: DrawingSpec;
  createdAt: string;
  updatedAt: string;
}

export interface DrawingSpec {
  type: 'tank' | 'basin' | 'pipe' | 'beam' | 'foundation' | 'custom';
  unit: 'mm' | 'm';
  views: ViewSpec[];
  titleBlock: TitleBlock;
}

export interface ViewSpec {
  id: string;
  type: 'plan' | 'section' | 'elevation' | 'detail';
  label: string;
  x: number;
  y: number;
  scale: number;
  shapes: Shape[];
  dimensions: Dimension[];
  labels: Label[];
}

export type Shape =
  | { type: 'circle'; cx: number; cy: number; r: number; fill?: string; stroke?: string; strokeWidth?: number; dashed?: boolean }
  | { type: 'rect'; x: number; y: number; w: number; h: number; fill?: string; stroke?: string; strokeWidth?: number }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; stroke?: string; strokeWidth?: number; dashed?: boolean }
  | { type: 'polyline'; points: [number, number][]; fill?: string; stroke?: string; strokeWidth?: number; closed?: boolean }
  | { type: 'arc'; cx: number; cy: number; r: number; startAngle: number; endAngle: number; stroke?: string; strokeWidth?: number }
  | { type: 'text'; x: number; y: number; text: string; fontSize?: number; anchor?: string; fill?: string; rotate?: number };

export interface Dimension {
  id: string;
  type: 'linear' | 'angular' | 'radial' | 'diameter';
  x1: number; y1: number;
  x2: number; y2: number;
  offset: number;
  text: string;
  unit?: string;
}

export interface Label {
  id: string;
  x: number; y: number;
  text: string;
  leaderX?: number; leaderY?: number;
  fontSize?: number;
}

export interface TitleBlock {
  title: string;
  drawingNo: string;
  revision: string;
  date: string;
  drawnBy: string;
  scale: string;
  project: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  spec: DrawingSpec;
}
