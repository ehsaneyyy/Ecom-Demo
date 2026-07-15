import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <Reveal>
        <p className="text-6xl sm:text-8xl font-bold text-theme-text-faint mb-4">404</p>
      </Reveal>
      <Reveal delay={100}>
        <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.03em] mb-3">Page not found</h1>
      </Reveal>
      <Reveal delay={200}>
        <p className="text-sm text-theme-text-faint mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </Reveal>
      <Reveal delay={300}>
        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors min-h-[48px]"
        >
          Back to Home
        </Link>
      </Reveal>
    </div>
  )
}
