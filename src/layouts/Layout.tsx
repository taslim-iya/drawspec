import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { PenTool, LayoutDashboard, BookTemplate, Settings, Layers, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/editor', icon: PenTool, label: 'Editor' },
  { to: '/templates', icon: BookTemplate, label: 'Templates' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const { pathname } = useLocation();
  const isEditor = pathname.startsWith('/editor');
  const [dark, setDark] = useState(() => localStorage.getItem('drawspec-theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('drawspec-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: isEditor ? 56 : 220,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.2s ease',
      }}>
        {/* Logo */}
        <div style={{
          padding: isEditor ? '16px 12px' : '20px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers size={16} color="white" />
          </div>
          {!isEditor && (
            <div>
              <span className="font-headline" style={{ fontSize: 17, color: 'var(--text)', display: 'block', lineHeight: 1.2 }}>DrawSpec</span>
              <span style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Engineering</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: isEditor ? '10px 0' : '10px 16px',
                margin: isEditor ? '2px 8px' : '2px 8px',
                borderRadius: 8, fontSize: 13, fontWeight: isActive ? 600 : 500,
                textDecoration: 'none', justifyContent: isEditor ? 'center' : 'flex-start',
                color: isActive ? 'var(--accent)' : 'var(--text-3)',
                background: isActive ? 'var(--accent-light)' : 'transparent',
                transition: 'all 0.15s',
              })}>
              <Icon size={17} />
              {!isEditor && label}
            </NavLink>
          ))}
        </nav>

        {/* Dark toggle */}
        <div style={{ padding: isEditor ? '12px 8px' : '12px 16px', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => setDark(!dark)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px', borderRadius: 8,
              border: 'none', cursor: 'pointer', fontSize: 12,
              background: 'var(--bg-alt)', color: 'var(--text-3)',
              justifyContent: isEditor ? 'center' : 'flex-start',
            }}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
            {!isEditor && (dark ? 'Light Mode' : 'Dark Mode')}
          </button>
          {!isEditor && (
            <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 8, opacity: 0.6 }}>DrawSpec v0.1</p>
          )}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', padding: isEditor ? 0 : 32, background: isEditor ? 'var(--bg)' : 'var(--bg-alt)' }}>
        <Outlet />
      </main>
    </div>
  );
}
