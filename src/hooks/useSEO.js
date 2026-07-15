import { useEffect } from 'react'

export function useSEO({ title, description, path }) {
  useEffect(() => {
    const base = 'ATELIER — Curated Objects for Considered Living'
    document.title = title ? `${title} | ATELIER` : base

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', description || 'Curated objects for considered living. Every piece crafted with intention, built to endure, designed to inspire.')
    }

    if (path) {
      const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('href', `https://atelier.com${path}`)
      if (!canonical.parentNode) document.head.appendChild(canonical)
    }
  }, [title, description, path])
}
