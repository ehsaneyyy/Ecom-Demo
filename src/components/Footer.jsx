import { useState } from 'react'
import { Link } from 'react-router-dom'
import { emailRegex } from '../utils/validate'

const footerLinks = {
  shop: [
    { name: 'All Products', to: '/category/all' },
    { name: 'Gift Cards', to: '/gift-cards' },
    { name: 'New Arrivals', to: '/category/all' },
    { name: 'Best Sellers', to: '/category/all' },
  ],
  company: [
    { name: 'About Us', to: '/about' },
    { name: 'Sustainability', to: '/sustainability' },
    { name: 'Press', to: '/press' },
    { name: 'Careers', to: '/coming-soon' },
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
    { name: 'Cookie Policy', to: '/terms' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim() && emailRegex.test(email)) {
      setSubscribed(true)
    }
  }

  return (
    <footer className="border-t border-theme-border bg-theme-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link to="/" className="text-lg font-semibold tracking-tight">ATELIER</Link>
            <p className="text-xs text-theme-text-faint mt-3 max-w-xs leading-relaxed">
              Curated objects for considered living. Every piece crafted with intention,
              built to endure, designed to inspire.
            </p>
            <div className="mt-6">
              {subscribed ? (
                <p className="text-xs text-theme-text-faint">Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email for newsletter"
                    className="flex-1 min-w-0 px-4 py-2.5 bg-theme-surface border border-theme-border text-xs text-theme-text-secondary placeholder-theme-text-faint focus:outline-none focus:border-theme-border-hover transition-colors"
                  />
                  <button type="submit" className="px-4 py-2.5 bg-theme-surface border border-theme-border border-l-0 text-[0.6rem] tracking-[0.15em] uppercase text-theme-text-faint hover:bg-theme-surface transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-[0.6rem] tracking-[0.2em] uppercase text-theme-text-faint mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-xs text-theme-text-faint hover:text-theme-text-muted transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.6rem] text-theme-text-faint">© 2026 Atelier. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="text-[0.6rem] text-theme-text-faint hover:text-theme-text-faint transition-colors" aria-label="Twitter">Twitter</a>
            <a href="#" className="text-[0.6rem] text-theme-text-faint hover:text-theme-text-faint transition-colors" aria-label="Instagram">Instagram</a>
            <a href="#" className="text-[0.6rem] text-theme-text-faint hover:text-theme-text-faint transition-colors" aria-label="Pinterest">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
