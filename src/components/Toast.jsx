import { useState, useCallback } from 'react'

let toastId = 0

const ToastContext = { listeners: new Set() }

export function useToast() {
  const [, forceUpdate] = useState(0)

  const show = useCallback((message, type = 'info') => {
    const id = ++toastId
    const toast = { id, message, type }

    ToastContext.listeners.forEach((fn) => fn((prev) => [...prev, toast]))

    setTimeout(() => {
      ToastContext.listeners.forEach((fn) => fn((prev) => prev.filter((t) => t.id !== id)))
    }, 3000)

    return id
  }, [])

  return { show }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useState(() => {
    ToastContext.listeners.add(setToasts)
    return () => ToastContext.listeners.delete(setToasts)
  })

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-[200] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-up px-5 py-3 rounded-lg border text-sm shadow-lg backdrop-blur-sm ${
            toast.type === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-300'
              : toast.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-300'
              : 'bg-white/10 border-white/10 text-white/70'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
