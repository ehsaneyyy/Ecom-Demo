import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import SearchOverlay from './SearchOverlay'

export default function Navbar() {
  const { count } = useCart()
  const { currentUser, isLoggedIn, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleToggleSearch = () => setSearchOpen(true)
    window.addEventListener('toggle-search', handleToggleSearch)
    return () => window.removeEventListener('toggle-search', handleToggleSearch)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setHidden(y > 100 && y > lastScrollY.current)
      lastScrollY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const linkClass = (path) =>
    `transition-colors ${isActive(path) ? 'text-white/80' : 'text-white/40 hover:text-white/70'}`

  if (pathname.startsWith('/admin')) return null

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5 transition-transform duration-300 ${hidden ? '-translate-y-full' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16">

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold tracking-tight text-white hover:text-white/70 transition-colors">
              ECOM DEMO
            </Link>
            <div className="hidden md:flex items-center gap-6 text-xs">
              <Link to="/" className={linkClass('/')}>Home</Link>
              <Link to="/category/all" className={linkClass('/category')}>Shop</Link>
              <Link to="/about" className={linkClass('/about')}>About</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5 text-xs"
              aria-label="Search products"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Search
            </button>
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5 text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[0.5rem] text-white/50">
                    {currentUser.name.charAt(0)}
                  </div>
                  {currentUser.name.split(' ')[0]}
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#141414] border border-white/10 rounded-lg shadow-xl z-50 py-2">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs text-white/70 font-medium">{currentUser.name}</p>
                        <p className="text-[0.6rem] text-white/30">{currentUser.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
                        My Orders
                      </Link>
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
                        Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-white/40 hover:text-white/70 transition-colors text-xs">Account</Link>
            )}
            <Link to="/cart" className={`${linkClass('/cart')} relative text-xs`}>
              Cart
              {count > 0 && (
                <span className="absolute -top-1.5 -right-4 text-[0.5rem] w-4 h-4 flex items-center justify-center bg-white/20 rounded-full text-white/70">
                  {count}
                </span>
              )}
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors" aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {count > 0 && (
                <span className="absolute top-1 right-1 text-[0.5rem] w-4 h-4 flex items-center justify-center bg-white/20 rounded-full text-white/70">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-14 left-0 right-0 bg-[#0a0a0a] border-b border-white/5 shadow-2xl animate-slide-down">
            <div className="px-6 py-6 space-y-1">
              <Link to="/" className={`block py-3 text-sm transition-colors ${isActive('/') ? 'text-white' : 'text-white/60 hover:text-white'}`}>Home</Link>
              <Link to="/category/all" className={`block py-3 text-sm transition-colors ${isActive('/category') ? 'text-white' : 'text-white/60 hover:text-white'}`}>Shop</Link>
              <Link to="/about" className={`block py-3 text-sm transition-colors ${isActive('/about') ? 'text-white' : 'text-white/60 hover:text-white'}`}>About</Link>
              <div className="border-t border-white/5 my-3" />
              {isLoggedIn ? (
                <>
                  <div className="py-3">
                    <p className="text-sm text-white/80 font-medium">{currentUser.name}</p>
                    <p className="text-xs text-white/30">{currentUser.email}</p>
                  </div>
                  <Link to="/orders" className="block py-3 text-sm text-white/60 hover:text-white transition-colors">My Orders</Link>
                  <Link to="/profile" className="block py-3 text-sm text-white/60 hover:text-white transition-colors">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left py-3 text-sm text-white/60 hover:text-white transition-colors">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="block py-3 text-sm text-white/60 hover:text-white transition-colors">Account</Link>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
