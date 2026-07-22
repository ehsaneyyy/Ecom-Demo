import { Link, useLocation } from 'react-router-dom'

export default function Breadcrumbs({ customItems }) {
  const { pathname } = useLocation()

  const items = customItems || generateBreadcrumbs(pathname)

  if (items.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="py-4 px-8 max-w-7xl mx-auto">
      <ol className="flex items-center gap-2 text-xs text-white/25">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-white/15">
                <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {item.href ? (
              <Link to={item.href} className="hover:text-white/50 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-white/50">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function generateBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  const items = [{ label: 'Home', href: '/' }]

  if (segments[0] === 'product' && segments[1]) {
    items.push({ label: 'Shop', href: '/' })
    items.push({ label: 'Product' })
  } else if (segments[0] === 'cart') {
    items.push({ label: 'Cart' })
  } else if (segments[0] === 'checkout') {
    items.push({ label: 'Cart', href: '/cart' })
    items.push({ label: 'Checkout' })
  } else if (segments[0] === 'category' && segments[1]) {
    items.push({ label: 'Shop', href: '/' })
    items.push({ label: decodeURIComponent(segments[1]) })
  } else if (segments[0] === 'about') {
    items.push({ label: 'About' })
  } else if (segments[0] === 'shipping') {
    items.push({ label: 'Shipping' })
  } else if (segments[0] === 'returns') {
    items.push({ label: 'Returns' })
  } else if (segments[0] === 'faq') {
    items.push({ label: 'FAQ' })
  } else if (segments[0] === 'privacy') {
    items.push({ label: 'Privacy' })
  } else if (segments[0] === 'terms') {
    items.push({ label: 'Terms' })
  }

  return items
}
