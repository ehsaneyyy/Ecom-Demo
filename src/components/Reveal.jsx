import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  left: { opacity: 0, x: -30 },
  right: { opacity: 0, x: 30 },
}

export default function Reveal({ children, direction, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={direction ? variants[direction] : variants.hidden}
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.25, 0.1, 0.25, 1] }}
      variants={{
        hidden: variants.hidden,
        visible: variants.visible,
        left: variants.visible,
        right: variants.visible,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
