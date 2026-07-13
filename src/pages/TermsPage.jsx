import Breadcrumbs from '../components/Breadcrumbs'

export default function TermsPage() {
  return (
    <div className="min-h-screen py-8 px-8">
      <Breadcrumbs />
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25 mb-4">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-6">Terms of Service</h1>
          <p className="text-sm text-white/30">Last updated: July 1, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3">Acceptance of Terms</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              By accessing or using the Atelier website, you agree to be bound by these Terms
              of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Products and Pricing</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              All prices are displayed in USD and are subject to change without notice. We reserve
              the right to modify or discontinue products at any time. Product images are
              representative and may differ slightly from the actual item.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Orders</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              By placing an order, you are making an offer to purchase. We reserve the right to
              accept or decline any order. An order confirmation email does not constitute acceptance;
              acceptance occurs only upon shipment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Intellectual Property</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              All content on this website, including text, images, logos, and design, is the
              property of Atelier and is protected by copyright and trademark laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Limitation of Liability</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              Atelier shall not be liable for any indirect, incidental, or consequential damages
              arising from the use of our products or services. Our total liability shall not
              exceed the purchase price of the product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Governing Law</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              These Terms are governed by the laws of the State of New York, without regard to
              conflict of law principles.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
