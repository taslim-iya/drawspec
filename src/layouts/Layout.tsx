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
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: isEditor ? 56 : 240,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: isEditor ? '16px 10px' : '24px 24px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99,91,255,0.25)',
              flexShrink: 0,
            }}>
              <Layers size={16} color="white" />
            </div>
            {!isEditor && (
              <div>
                <span className="font-headline" style={{ fontSize: 18, color: 'var(--text)', display: 'block', lineHeight: 1.1 }}>DrawSpec</span>
                <span style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>Engineering</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 11,
                padding: isEditor ? '10px 0' : '10px 14px',
                margin: '2px 0', borderRadius: 8,
                fontSize: 13, fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                justifyContent: isEditor ? 'center' : 'flex-start',
                color: isActive ? 'var(--accent)' : 'var(--text-2)',
                background: isActive ? 'var(--accent-light)' : 'transparent',
                transition: 'all 0.15s',
                letterSpacing: '-0.01em',
              })}>
              <Icon size={17} strokeWidth={isEditor ? 2 : 1.8} />
              {!isEditor && label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: isEditor ? '12px 8px' : '16px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={() => setDark(!dark)}
            style={{
              display: 'flex', alignItems: 'center', gap: 9, width: '100%',
              padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)',
              cursor: 'pointer', fontSize: 12, fontWeight: 500,
              background: 'var(--bg-alt)', color: 'var(--text-2)',
              justifyContent: isEditor ? 'center' : 'flex-start',
              transition: 'all 0.15s',
            }}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
            {!isEditor && (dark ? 'Light Mode' : 'Dark Mode')}
          </button>
          {!isEditor && (
            <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 12, opacity: 0.5, letterSpacing: '0.04em' }}>v0.1.0 · DrawSpec</p>
          )}
        </div>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1, overflow: 'auto',
        padding: isEditor ? 0 : '36px 40px',
        background: isEditor ? 'var(--bg)' : 'var(--bg-alt)',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
