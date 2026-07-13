import Breadcrumbs from '../components/Breadcrumbs'

export default function ShippingPage() {
  return (
    <div className="min-h-screen py-8 px-8">
      <Breadcrumbs />
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25 mb-4">Shipping</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-6">Shipping Policy</h1>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-lg font-semibold mb-4">Free Shipping</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We offer free standard shipping on all orders over $100 within the United States.
              Orders under $100 ship for a flat rate of $12.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Shipping Options</h2>
            <div className="space-y-4">
              {[
                { name: 'Standard Shipping', time: '5–7 business days', price: 'Free over $100, otherwise $12' },
                { name: 'Express Shipping', time: '2–3 business days', price: '$25' },
                { name: 'Overnight Shipping', time: '1 business day', price: '$45' },
              ].map((opt) => (
                <div key={opt.name} className="flex items-center justify-between py-4 border-b border-white/5">
                  <div>
                    <p className="text-sm text-white/70">{opt.name}</p>
                    <p className="text-xs text-white/30">{opt.time}</p>
                  </div>
                  <span className="text-sm text-white/50">{opt.price}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">International Shipping</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We ship to over 50 countries worldwide. International shipping rates and delivery
              times vary by destination. Duties and taxes are calculated at checkout so there
              are no surprise fees upon delivery.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Order Tracking</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              Once your order ships, you'll receive a confirmation email with a tracking number.
              You can track your package in real-time through our order tracking page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
