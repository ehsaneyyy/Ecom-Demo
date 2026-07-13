import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-8">
      <Breadcrumbs />
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25 mb-4">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-6">Designed to last</h1>
          <p className="text-sm text-white/35 leading-relaxed max-w-2xl">
            Atelier was born from a simple belief: the objects we surround ourselves with shape how we live.
            We partner with independent makers who share our commitment to craftsmanship, sustainability,
            and timeless design.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We curate objects that are built to endure — not just physically, but aesthetically.
              Every piece in our collection has been selected for its quality of materials, integrity
              of construction, and timelessness of design.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Our Makers</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We work with small studios and independent craftspeople around the world. Each maker
              brings generations of knowledge and a deep respect for their materials. When you buy
              from Atelier, you're supporting a tradition of handmade excellence.
            </p>
          </div>
        </div>

        <div className="py-16 border-t border-white/5">
          <h2 className="text-xl font-semibold mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Craftsmanship', desc: 'Every piece is made by hand with meticulous attention to detail.' },
              { title: 'Sustainability', desc: 'Responsibly sourced materials and minimal-waste production.' },
              { title: 'Longevity', desc: 'Designed to last a lifetime, not a season.' },
            ].map((v) => (
              <div key={v.title}>
                <h3 className="text-sm font-semibold text-white/70 mb-2">{v.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="py-16 border-t border-white/5 text-center">
          <p className="text-sm text-white/30 mb-6">Questions? We'd love to hear from you.</p>
          <a
            href="mailto:hello@atelier.com"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/15 text-xs tracking-[0.2em] uppercase text-white/60 hover:bg-white hover:text-black transition-all duration-500"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  )
}
