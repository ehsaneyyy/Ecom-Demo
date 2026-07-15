export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-white/5 mb-4" />
      <div className="h-3 bg-white/5 w-3/4 mb-2" />
      <div className="h-2 bg-white/5 w-1/3" />
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-2.5 bg-white/5" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  )
}

export function SkeletonCircle({ size = 32, className = '' }) {
  return <div className={`animate-pulse bg-white/5 rounded-full ${className}`} style={{ width: size, height: size }} />
}

export function SkeletonImage({ aspect = 'aspect-square', className = '' }) {
  return <div className={`animate-pulse bg-white/5 ${aspect} ${className}`} />
}
