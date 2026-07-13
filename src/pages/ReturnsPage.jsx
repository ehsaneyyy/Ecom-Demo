import Breadcrumbs from '../components/Breadcrumbs'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen py-8 px-8">
      <Breadcrumbs />
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25 mb-4">Returns</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-6">Return Policy</h1>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-lg font-semibold mb-4">30-Day Returns</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We want you to love your purchase. If you're not completely satisfied, you can return
              most items within 30 days of delivery for a full refund or exchange.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">How to Start a Return</h2>
            <ol className="space-y-4 text-sm text-white/35 leading-relaxed">
              <li className="flex gap-3">
                <span className="text-white/50 font-semibold">1.</span>
                <span>Log into your account and navigate to your order history.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white/50 font-semibold">2.</span>
                <span>Select the item you'd like to return and choose a reason.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white/50 font-semibold">3.</span>
                <span>Print your prepaid return label and pack the item securely.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white/50 font-semibold">4.</span>
                <span>Drop off the package at your nearest shipping location.</span>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Refund Timeline</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              Once we receive your return, please allow 3–5 business days for processing.
              Refunds will be credited to your original payment method within 7–10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Exchanges</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We offer free exchanges for items of equal value. If you'd like a different size,
              color, or product, simply select "Exchange" when initiating your return.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Exceptions</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              Items must be in their original condition with tags attached. Personalized or
              custom-made items cannot be returned unless defective.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
