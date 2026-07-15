import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Reveal({ children, direction, delay = 0, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const [safe, setSafe] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const timer = setTimeout(() => setSafe(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  const from =
    direction === 'left'
      ? { opacity: 0, x: -30 }
      : direction === 'right'
        ? { opacity: 0, x: 30 }
        : { opacity: 0, y: 20 }

  const show = isInView || safe

  return (
    <motion.div
      ref={ref}
      initial={from}
      animate={show ? { opacity: 1, x: 0, y: 0 } : from}
      transition={{ duration: 0.5, delay: show ? delay / 1000 : 0, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
