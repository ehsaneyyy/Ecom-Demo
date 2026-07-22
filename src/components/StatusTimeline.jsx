

const STATUSES = ['pending', 'processing', 'shipped', 'delivered']

const STATUS_LABELS = {
  pending: 'Order Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const STATUS_ICONS = {
  pending: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  processing: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  shipped: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  delivered: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  cancelled: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
}

export default function StatusTimeline({ status }) {
  const currentStatusIndex = STATUSES.indexOf(status)
  const isCancelled = status === 'cancelled'

  return (
    <div className="space-y-0">
      {STATUSES.map((s, i) => {
        const isCompleted = !isCancelled && i < currentStatusIndex
        const isCurrent = s === status
        const isPending = !isCancelled && i > currentStatusIndex

        return (
          <div key={s} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                isCompleted ? 'bg-[#4ade80]/20 text-[#4ade80]' :
                isCurrent ? 'bg-[#60a5fa]/20 text-[#60a5fa]' :
                'bg-white/5 text-white/20'
              }`}>
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={STATUS_ICONS[s]} />
                  </svg>
                )}
              </div>
              {i < STATUSES.length - 1 && (
                <div className={`w-px flex-1 min-h-[24px] ${
                  isCompleted ? 'bg-[#4ade80]/30' : 'bg-white/10'
                }`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`text-sm font-medium ${
                isCurrent ? 'text-white/70' :
                isCompleted ? 'text-[#4ade80]/70' :
                'text-white/20'
              }`}>
                {STATUS_LABELS[s]}
              </p>
              {isCurrent && (
                <p className="text-[0.6rem] text-white/30 mt-0.5 capitalize">{status}</p>
              )}
            </div>
          </div>
        )
      })}

      {isCancelled && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-400/20 text-red-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
          <div className="pb-6">
            <p className="text-sm font-medium text-red-400/70">Cancelled</p>
          </div>
        </div>
      )}
    </div>
  )
}
