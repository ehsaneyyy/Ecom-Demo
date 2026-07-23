import { Link } from 'react-router-dom'

const footerLinks = {
  shop: [
    { name: 'All Products', to: '/category/all' },
    { name: 'New Arrivals', to: '/category/all' },
    { name: 'Best Sellers', to: '/category/all' },
  ],
  company: [
    { name: 'About Us', to: '/about' },
    { name: 'Sustainability', to: '/sustainability' },
    { name: 'Press', to: '/press' },
  ],
  support: [
    { name: 'FAQ', to: '/faq' },
    { name: 'Shipping', to: '/shipping' },
    { name: 'Returns & Exchanges', to: '/returns' },
    { name: 'Contact', to: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', to: '/privacy' },
    { name: 'Terms of Service', to: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="text-lg font-semibold tracking-tight">ATELIER</Link>
            <p className="text-xs text-white/30 mt-3 max-w-xs leading-relaxed">
              Curated objects for considered living. Every piece crafted with intention,
              built to endure, designed to inspire.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-[0.6rem] tracking-[0.2em] uppercase text-white/30 mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-xs text-white/30 hover:text-white/50 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.6rem] text-white/30">© 2026 Ecom Demo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
