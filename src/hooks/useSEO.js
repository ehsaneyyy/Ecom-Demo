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

export function useProductSEO(product) {
  useSEO({
    title: product ? product.name : undefined,
    description: product ? product.desc : undefined,
    path: product ? `/product/${product.id}` : undefined,
  })

  useEffect(() => {
    if (!product) return

    const existing = document.getElementById('product-schema')
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.id = 'product-schema'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.desc,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    })
    document.head.appendChild(script)

    return () => script.remove()
  }, [product])
}
