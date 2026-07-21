import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/Reveal'

export default function AdminChooser() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Choose View — ATELIER'
  }, [])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Reveal>
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p className="text-[0.6rem] tracking-[0.25em] uppercase text-white/30 mb-4">
              {currentUser?.email}
            </p>
            <h1 className="text-3xl font-bold tracking-[-0.03em] mb-3">Welcome back</h1>
            <p className="text-sm text-white/30">Where would you like to go?</p>
          </div>
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={100}>
            <Link
              to="/"
              className="group block w-full p-6 bg-[#141414] border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.08] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-white/60 transition-colors">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-white/70 font-medium">Go to Store</p>
                  <p className="text-[0.6rem] text-white/30 mt-0.5">Browse and shop the collection</p>
                </div>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={180}>
            <Link
              to="/admin"
              className="group block w-full p-6 bg-white text-black rounded-lg hover:bg-white/90 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-lg bg-black/[0.06] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/40">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Admin Panel</p>
                  <p className="text-[0.6rem] text-black/40 mt-0.5">Manage orders, products and customers</p>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
