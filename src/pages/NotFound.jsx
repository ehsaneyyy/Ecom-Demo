import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="animate-fade-in min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl sm:text-8xl font-bold text-white/5 mb-4">404</p>
      <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.03em] mb-3">Page not found</h1>
      <p className="text-sm text-white/30 mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors min-h-[48px]"
      >
        Back to Home
      </Link>
    </div>
  )
}
