import { useScrollReveal } from '../hooks/useScrollReveal'

const directions = {
  up: { hidden: 'opacity-0 translate-y-8', visible: 'opacity-100 translate-y-0' },
  down: { hidden: 'opacity-0 -translate-y-8', visible: 'opacity-100 translate-y-0' },
  left: { hidden: 'opacity-0 translate-x-8', visible: 'opacity-100 translate-x-0' },
  right: { hidden: 'opacity-0 -translate-x-8', visible: 'opacity-100 translate-x-0' },
  scale: { hidden: 'opacity-0 scale-95', visible: 'opacity-100 scale-100' },
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  className = '',
  as: Tag = 'div',
}) {
  const [ref, isVisible] = useScrollReveal()
  const dir = directions[direction] || directions.up

  return (
    <Tag
      ref={ref}
      className={`transition-all ease-out ${isVisible ? dir.visible : dir.hidden} ${className}`}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
