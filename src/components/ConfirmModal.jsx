import useFocusTrap from '../hooks/useFocusTrap'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  const trapRef = useFocusTrap(open)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div ref={trapRef} className="relative bg-[#141414] border border-white/10 rounded-xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
        <h3 id="confirm-title" className="text-base font-semibold text-white/70 mb-2">{title}</h3>
        <p className="text-sm text-white/30 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[40px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 bg-red-500/20 border border-red-500/30 text-xs text-red-400 hover:bg-red-500/30 transition-colors min-h-[40px]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
