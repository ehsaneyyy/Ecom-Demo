import { useEffect } from 'react'
import Reveal from '../components/Reveal'

export default function ComingSoon({ title, description }) {
  useEffect(() => {
    document.title = `${title || 'Page'} — Coming Soon | ATELIER`
  }, [title])

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <Reveal>
          <div className="w-16 h-16 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="text-3xl font-bold tracking-[-0.03em] mb-3">{title || 'Coming Soon'}</h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-sm text-white/30 mb-8 leading-relaxed">
            {description || "We're working on this. Stay tuned for something great."}
          </p>
        </Reveal>
        <Reveal delay={300}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.history.back() }}
            className="text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            ← Go back
          </a>
        </Reveal>
      </div>
    </div>
  )
}
