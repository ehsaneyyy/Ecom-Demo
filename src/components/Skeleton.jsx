export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-[#141414] mb-4 overflow-hidden relative">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </div>
      <div className="h-3 bg-[#141414] w-3/4 mb-2" />
      <div className="h-2 bg-[#141414] w-1/3" />
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-2.5 bg-[#141414]" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  )
}

export function SkeletonCircle({ size = 32, className = '' }) {
  return <div className={`animate-pulse bg-[#141414] rounded-full ${className}`} style={{ width: size, height: size }} />
}

export function SkeletonImage({ aspect = 'aspect-square', className = '' }) {
  return <div className={`animate-pulse bg-[#141414] ${aspect} ${className}`} />
}
