import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { PenTool, LayoutDashboard, BookTemplate, Settings, Layers } from 'lucide-react';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/editor', icon: PenTool, label: 'Editor' },
  { to: '/templates', icon: BookTemplate, label: 'Templates' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const { pathname } = useLocation();
  const isEditor = pathname.startsWith('/editor');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isEditor ? 'w-16' : 'w-60'} bg-white border-r border-gray-200 flex flex-col transition-all duration-200`}>
        <div className={`${isEditor ? 'px-3' : 'px-5'} py-5 border-b border-gray-100`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Layers size={16} className="text-white" />
            </div>
            {!isEditor && <span className="text-base font-bold text-gray-900 tracking-tight">DrawSpec</span>}
          </div>
        </div>
        <nav className="flex-1 py-3">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 ${isEditor ? 'justify-center px-0 mx-2' : 'px-4 mx-2'} py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }>
              <Icon size={18} />
              {!isEditor && label}
            </NavLink>
          ))}
        </nav>
        <div className={`${isEditor ? 'px-3' : 'px-5'} py-4 border-t border-gray-100`}>
          {!isEditor && (
            <p className="text-xs text-gray-400">DrawSpec v0.1 — Engineering drawings, simplified</p>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 overflow-auto ${isEditor ? '' : 'p-8'}`}>
        <Outlet />
      </main>
    </div>
  );
}
