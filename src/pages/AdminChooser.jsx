import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/Reveal'

export default function AdminChooser() {
  const { currentUser } = useAuth()

  useEffect(() => {
    document.title = 'Choose View — ATELIER'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <Reveal>
          <p className="text-[0.6rem] tracking-[0.25em] uppercase text-white/30 mb-6">Signed in as {currentUser?.email}</p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="text-3xl font-bold tracking-[-0.03em] mb-3">Welcome back</h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-sm text-white/30 mb-10">Where would you like to go?</p>
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={180}>
            <Link
              to="/"
              className="block w-full py-4 border border-white/10 text-xs tracking-[0.15em] uppercase text-white/50 hover:bg-white hover:text-black transition-all duration-300"
            >
              Go to Store
            </Link>
          </Reveal>
          <Reveal delay={240}>
            <Link
              to="/admin"
              className="block w-full py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
            >
              Admin Panel
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
