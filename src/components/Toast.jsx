import { useState, useCallback, useEffect, useRef } from 'react'

let toastId = 0

const ToastContext = { listeners: new Set() }

export function useToast() {
  const show = useCallback((message, type = 'info') => {
    const id = ++toastId
    const toast = { id, message, type, exiting: false }

    ToastContext.listeners.forEach((fn) => fn((prev) => [...prev.slice(-2), toast]))

    setTimeout(() => {
      ToastContext.listeners.forEach((fn) =>
        fn((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
      )
      setTimeout(() => {
        ToastContext.listeners.forEach((fn) => fn((prev) => prev.filter((t) => t.id !== id)))
      }, 250)
    }, 3000)

    return id
  }, [])

  return { show }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    ToastContext.listeners.add(setToasts)
    return () => ToastContext.listeners.delete(setToasts)
  }, [])

  const dismiss = (id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 250)
  }

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-[200] space-y-2" role="alert" aria-live="assertive">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-5 py-3 pr-9 rounded-lg border text-sm shadow-lg backdrop-blur-sm relative ${
            toast.exiting ? 'animate-fade-out' : 'animate-slide-up'
          } ${
            toast.type === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-300'
              : toast.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-300'
              : 'bg-theme-surface border-theme-border text-theme-text-secondary'
          }`}
        >
          {toast.message}
          <button
            onClick={() => dismiss(toast.id)}
            className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-theme-text-faint hover:text-theme-text-muted transition-colors"
            aria-label="Dismiss"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
