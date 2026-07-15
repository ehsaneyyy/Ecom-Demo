import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import SearchOverlay from './SearchOverlay'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { count } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { currentUser, isLoggedIn, logout, isAdmin } = useAuth()
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
    `transition-colors ${isActive(path) ? 'text-theme-text-secondary' : 'hover:text-theme-text-secondary'}`

  if (pathname.startsWith('/admin')) return null

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-theme-bg/80 backdrop-blur-lg border-b border-theme-border transition-transform duration-300 ${hidden && mobileOpen ? '-translate-y-full' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16">
          <Link to="/" className="text-sm font-semibold tracking-tight hover:text-theme-text-secondary transition-colors">
            ATELIER
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs text-theme-text-faint">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/category/all" className={linkClass('/category')}>Shop</Link>
            <Link to="/about" className={linkClass('/about')}>About</Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-theme-text-secondary transition-colors flex items-center gap-1.5"
              aria-label="Search products"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Search
            </button>
            <ThemeToggle />
            <Link to="/wishlist" className={`${linkClass('/wishlist')} relative`} aria-label="Wishlist">
              Wishlist
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-4 text-[0.5rem] w-4 h-4 flex items-center justify-center bg-white/20 rounded-full text-white/70">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="hover:text-theme-text-secondary transition-colors flex items-center gap-1.5"
                >
                  <div className="w-5 h-5 rounded-full bg-theme-surface flex items-center justify-center text-[0.5rem] text-theme-text-muted">
                    {currentUser.name.charAt(0)}
                  </div>
                  {currentUser.name.split(' ')[0]}
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-theme-surface border border-theme-border rounded-lg shadow-xl z-50 py-2">
                      <div className="px-4 py-2 border-b border-theme-border">
                        <p className="text-xs text-theme-text-secondary font-medium">{currentUser.name}</p>
                        <p className="text-[0.6rem] text-theme-text-faint">{currentUser.email}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-xs text-theme-text-faint hover:text-theme-text-secondary hover:bg-theme-surface-hover transition-colors">
                          Admin Panel
                        </Link>
                      )}
                      <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-xs text-theme-text-faint hover:text-theme-text-secondary hover:bg-theme-surface-hover transition-colors">
                        My Orders
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs text-theme-text-faint hover:text-theme-text-secondary hover:bg-theme-surface-hover transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-theme-text-secondary transition-colors">Account</Link>
            )}
            <Link to="/cart" className={`${linkClass('/cart')} relative`}>
              Cart
              {count > 0 && (
                <span className="absolute -top-1.5 -right-4 text-[0.5rem] w-4 h-4 flex items-center justify-center bg-white/20 rounded-full text-white/70">
                  {count}
                </span>
              )}
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-theme-text-faint hover:text-theme-text-secondary transition-colors"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center text-theme-text-faint hover:text-theme-text-secondary transition-colors" aria-label="Cart">
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
              className="w-10 h-10 flex items-center justify-center text-theme-text-faint hover:text-theme-text-secondary transition-colors"
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
          <div className="absolute top-14 left-0 right-0 bg-theme-bg border-b border-theme-border shadow-2xl animate-slide-down">
            <div className="px-6 py-6 space-y-1">
              <Link to="/" className={`block py-3 text-sm transition-colors ${isActive('/') ? 'text-white' : 'text-theme-text-muted hover:text-white'}`}>Home</Link>
              <Link to="/category/all" className={`block py-3 text-sm transition-colors ${isActive('/category') ? 'text-white' : 'text-theme-text-muted hover:text-white'}`}>Shop</Link>
              <Link to="/about" className={`block py-3 text-sm transition-colors ${isActive('/about') ? 'text-white' : 'text-theme-text-muted hover:text-white'}`}>About</Link>
              <Link to="/wishlist" className={`block py-3 text-sm transition-colors ${isActive('/wishlist') ? 'text-white' : 'text-theme-text-muted hover:text-white'}`}>
                Wishlist {wishlistCount > 0 && <span className="text-theme-text-faint">({wishlistCount})</span>}
              </Link>
              <div className="border-t border-theme-border my-3" />
              {isLoggedIn ? (
                <>
                  <div className="py-3">
                    <p className="text-sm text-theme-text-secondary font-medium">{currentUser.name}</p>
                    <p className="text-xs text-theme-text-faint">{currentUser.email}</p>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="block py-3 text-sm text-theme-text-muted hover:text-white transition-colors">Admin Panel</Link>
                  )}
                  <Link to="/orders" className="block py-3 text-sm text-theme-text-muted hover:text-white transition-colors">My Orders</Link>
                  <button onClick={handleLogout} className="block w-full text-left py-3 text-sm text-theme-text-muted hover:text-white transition-colors">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="block py-3 text-sm text-theme-text-muted hover:text-white transition-colors">Account</Link>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
