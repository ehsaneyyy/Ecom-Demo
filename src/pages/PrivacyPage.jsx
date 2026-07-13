import Breadcrumbs from '../components/Breadcrumbs'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-8 px-8">
      <Breadcrumbs />
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25 mb-4">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-6">Privacy Policy</h1>
          <p className="text-sm text-white/30">Last updated: July 1, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3">Information We Collect</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We collect information you provide directly, such as your name, email address,
              shipping address, and payment information when you create an account, make a
              purchase, or contact us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">How We Use Your Information</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We use your information to process orders, communicate about your purchases,
              improve our products and services, and send marketing communications (with your
              consent). We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Data Security</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We implement industry-standard security measures to protect your personal information.
              All payment data is encrypted and processed through PCI-DSS compliant systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Cookies</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              We use cookies to improve your browsing experience, analyze site traffic, and
              personalize content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Your Rights</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              Depending on your location, you may have rights to access, correct, or delete your
              personal data. To exercise these rights, please contact us at privacy@atelier.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Contact</h2>
            <p className="text-sm text-white/35 leading-relaxed">
              For privacy-related inquiries, please contact us at privacy@atelier.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
