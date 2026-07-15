import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function useFocusTrap(active) {
  const containerRef = useRef(null)
  const previousRef = useRef(null)

  useEffect(() => {
    if (!active) return
    previousRef.current = document.activeElement
    const container = containerRef.current
    if (!container) return

    const firstFocusable = container.querySelector(FOCUSABLE)
    if (firstFocusable) firstFocusable.focus()

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const focusables = container.querySelectorAll(FOCUSABLE)
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousRef.current?.focus()
    }
  }, [active])

  return containerRef
}
