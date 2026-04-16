import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { templates } from '@/lib/templates';
import { useDrawingStore } from '@/stores/drawingStore';
import type { Drawing } from '@/lib/types';

export default function Templates() {
  const navigate = useNavigate();
  const { addDrawing } = useDrawingStore();

  const useTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    const newDrawing: Drawing = {
      id: `drawing-${Date.now()}`,
      name: template.name,
      description: template.description,
      spec: template.spec,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addDrawing(newDrawing);
    navigate(`/editor/${newDrawing.id}`);
  };

  const categories = [...new Set(templates.map((t) => t.category))];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Templates</h1>
      <p className="text-gray-500 text-sm mb-8">Pre-built engineering drawing templates. Click to create a new drawing.</p>

      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">{cat}</h2>
          <div className="grid gap-3">
            {templates.filter((t) => t.category === cat).map((t) => (
              <button key={t.id} onClick={() => useTemplate(t.id)}
                className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left w-full">
                <span className="text-2xl">{t.thumbnail}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.description}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
