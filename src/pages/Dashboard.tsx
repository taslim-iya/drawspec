import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, PenTool } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawingStore';
import { templates } from '@/lib/templates';

export default function Dashboard() {
  const { drawings } = useDrawingStore();

  return (
    <div className="max-w-5xl">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">DrawSpec</h1>
        <p className="text-gray-500 text-base">Engineering drawings from text specifications. No AutoCAD required.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Link to="/editor" className="group flex items-center gap-4 p-5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm">New Drawing</p>
            <p className="text-indigo-200 text-xs">From text or template</p>
          </div>
        </Link>
        <Link to="/editor/demo-fst" className="group flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PenTool size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">Demo: FST Drawing</p>
            <p className="text-gray-400 text-xs">25m diameter settlement tank</p>
          </div>
        </Link>
        <Link to="/templates" className="group flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">Browse Templates</p>
            <p className="text-gray-400 text-xs">{templates.length} engineering templates</p>
          </div>
        </Link>
      </div>

      {/* Recent Drawings */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Drawings</h2>
        {drawings.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
            <FileText size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">No drawings yet. Create one from a template or text spec.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {drawings.map((d) => (
              <Link key={d.id} to={`/editor/${d.id}`}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-400">{d.description?.slice(0, 80)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock size={12} />
                  {new Date(d.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
