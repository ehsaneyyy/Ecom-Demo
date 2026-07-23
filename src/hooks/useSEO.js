import { useEffect } from 'react'

export function useSEO({ title, description, path }) {
  useEffect(() => {
    const base = 'Ecom Demo — Premium Store'
    document.title = title ? `${title} | Ecom Demo` : base

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', description || 'Premium e-commerce store. Curated products, fast checkout, seamless experience.')
    }

    if (path) {
      const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('href', `https://ecom-demo.vercel.app${path}`)
      if (!canonical.parentNode) document.head.appendChild(canonical)
    }
  }, [title, description, path])
}
