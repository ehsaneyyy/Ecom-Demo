import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { to: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { to: '/admin/orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: '/admin/customers', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-theme-bg">
      <div className="hidden md:flex md:w-56 md:flex-shrink-0">
        <div className="w-56 bg-theme-surface border-r border-theme-border flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-theme-border">
            <span className="text-xs font-semibold tracking-[0.2em] text-theme-text-muted">ATELIER ADMIN</span>
          </div>
          <nav className="flex-1 py-4 px-3 space-y-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-theme-surface text-white/90' : 'text-theme-text-faint hover:text-theme-text-muted hover:bg-theme-surface-hover'
                  }`
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-theme-border">
            <NavLink to="/" className="flex items-center gap-2 text-xs text-theme-text-faint hover:text-theme-text-faint transition-colors">
              ← Back to Store
            </NavLink>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-theme-surface border-r border-theme-border shadow-2xl animate-slide-down">
            <div className="h-16 flex items-center px-6 border-b border-theme-border">
              <span className="text-xs font-semibold tracking-[0.2em] text-theme-text-muted">ATELIER ADMIN</span>
            </div>
            <nav className="py-4 px-3 space-y-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive ? 'bg-theme-surface text-white/90' : 'text-theme-text-faint hover:text-theme-text-muted hover:bg-theme-surface-hover'
                    }`
                  }
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-theme-border">
              <NavLink to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 text-xs text-theme-text-faint hover:text-theme-text-faint transition-colors">
                ← Back to Store
              </NavLink>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-theme-border flex items-center px-4 sm:px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-theme-text-faint hover:text-theme-text-secondary transition-colors"
            aria-label="Open navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-theme-surface flex items-center justify-center text-[0.5rem] text-theme-text-faint">
              A
            </div>
            <span className="text-xs text-theme-text-faint hidden sm:block">admin@atelier.com</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
