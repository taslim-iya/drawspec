import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Drawing } from '@/lib/types';
import { templates } from '@/lib/templates';

interface DrawingState {
  drawings: Drawing[];
  activeDrawingId: string | null;
  zoom: number;
  panX: number;
  panY: number;
  activeLayers: string[];
  addDrawing: (drawing: Drawing) => void;
  removeDrawing: (id: string) => void;
  setActiveDrawing: (id: string | null) => void;
  updateDrawing: (id: string, updates: Partial<Drawing>) => void;
  setZoom: (z: number) => void;
  setPan: (x: number, y: number) => void;
  toggleLayer: (layer: string) => void;
}

// Create demo FST drawing from template
const demoDrawing: Drawing = {
  id: 'demo-fst',
  name: 'Final Settlement Tank — 25m Diameter',
  description: 'Circular FST with central column, scraper mechanism, 7.5° floor slope. Designed per Nikolai\'s specification.',
  spec: templates[0].spec,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useDrawingStore = create<DrawingState>()(
  persist(
    (set) => ({
      drawings: [demoDrawing],
      activeDrawingId: null,
      zoom: 1,
      panX: 0,
      panY: 0,
      activeLayers: ['structure', 'dimensions', 'labels', 'annotations'],
      addDrawing: (drawing) => set((s) => ({ drawings: [...s.drawings, drawing] })),
      removeDrawing: (id) => set((s) => ({ drawings: s.drawings.filter((d) => d.id !== id) })),
      setActiveDrawing: (id) => set({ activeDrawingId: id }),
      updateDrawing: (id, updates) =>
        set((s) => ({
          drawings: s.drawings.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d)),
        })),
      setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
      setPan: (panX, panY) => set({ panX, panY }),
      toggleLayer: (layer) =>
        set((s) => ({
          activeLayers: s.activeLayers.includes(layer)
            ? s.activeLayers.filter((l) => l !== layer)
            : [...s.activeLayers, layer],
        })),
    }),
    { name: 'drawspec-store' }
  )
);
