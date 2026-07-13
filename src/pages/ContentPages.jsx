import { useLocation } from 'react-router-dom'

const pages = {
  '/about': {
    title: 'About Atelier',
    sections: [
      { heading: 'Our Story', text: 'Founded in 2024, Atelier was born from a simple belief: the objects we surround ourselves with shape our daily experience. We partner directly with independent makers and small studios who share our commitment to craft, quality, and sustainability.' },
      { heading: 'Our Mission', text: 'To curate a collection of thoughtfully designed, expertly crafted objects that bring intention and beauty to everyday life. Every product in our collection is chosen for its quality, design integrity, and the story behind its creation.' },
      { heading: 'Our Makers', text: 'We work with over 40 independent makers across 12 countries. From ceramicists in Kyoto to leather workers in Florence, our network represents the best of contemporary craft. Each maker is selected not just for skill, but for their commitment to sustainable practices and fair labor.' },
      { heading: 'Quality Promise', text: 'Every product we sell is backed by our quality guarantee. If something doesn\'t meet your expectations, we\'ll make it right. We stand behind the craftsmanship of every item in our collection.' },
    ],
  },
  '/shipping': {
    title: 'Shipping',
    sections: [
      { heading: 'Free Shipping', text: 'We offer free standard shipping on all orders over $200 within the continental United States. Orders under $200 ship for a flat rate of $15.' },
      { heading: 'Shipping Methods', text: 'Standard shipping: 5-7 business days. Express shipping: 2-3 business days ($25). Overnight shipping: Next business day ($40). International shipping available to 30+ countries — rates calculated at checkout.' },
      { heading: 'Processing Time', text: 'Most orders ship within 1-2 business days. Handmade and custom items may require additional processing time — this will be noted on the product page.' },
      { heading: 'Tracking', text: 'You\'ll receive a shipping confirmation email with tracking information once your order ships. Track your package anytime from your account dashboard.' },
    ],
  },
  '/returns': {
    title: 'Returns & Exchanges',
    sections: [
      { heading: '30-Day Returns', text: 'We accept returns within 30 days of delivery. Items must be unused, in their original packaging, and in the same condition you received them.' },
      { heading: 'How to Return', text: 'Log into your account, select the order, and click "Request Return." We\'ll email you a prepaid shipping label. Pack the item securely and drop it off at any authorized shipping location.' },
      { heading: 'Refunds', text: 'Refunds are processed within 5 business days of receiving your return. The refund will be credited to your original payment method. Please allow 5-10 business days for the refund to appear on your statement.' },
      { heading: 'Exchanges', text: 'Need a different size or color? Contact us at hello@atelier.com and we\'ll arrange an exchange. We cover shipping on exchanges for defective or incorrect items.' },
      { heading: 'Exceptions', text: 'Final sale items, personalized products, and gift cards cannot be returned. Damaged items must be reported within 48 hours of delivery with photos.' },
    ],
  },
  '/faq': {
    title: 'FAQ',
    sections: [
      { heading: 'How do I track my order?', text: 'Once your order ships, you\'ll receive an email with tracking information. You can also check your order status from your account dashboard.' },
      { heading: 'Can I change or cancel my order?', text: 'Orders can be modified or cancelled within 2 hours of placing them. After that, we begin processing and cannot make changes. Contact us immediately at hello@atelier.com if you need to make a change.' },
      { heading: 'Do you ship internationally?', text: 'Yes, we ship to over 30 countries. International shipping rates are calculated at checkout based on destination and package weight. Customs duties and taxes are the responsibility of the recipient.' },
      { heading: 'How do I care for my products?', text: 'Each product page includes specific care instructions. Generally, our ceramic and stoneware items are dishwasher safe. Leather goods should be conditioned periodically. Textiles should be washed according to the care label.' },
      { heading: 'Are your products sustainable?', text: 'We prioritize sustainability in every decision. Most of our makers use responsibly sourced materials and eco-friendly production methods. We\'re working toward full transparency — our sustainability report launches soon.' },
      { heading: 'Do you offer wholesale?', text: 'Yes, we offer wholesale pricing for qualified retailers. Contact us at wholesale@atelier.com with your business details and we\'ll get back to you within 48 hours.' },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy',
    sections: [
      { heading: 'Information We Collect', text: 'When you visit Atelier, we automatically collect certain information about your device, including your web browser, IP address, time zone, and some cookies. We also collect information about the individual web pages you view, what websites or search terms referred you, and how you interact with the site.' },
      { heading: 'How We Use Your Information', text: 'We use order information to fulfill orders, process payments, arrange shipping, and provide invoices. We use device information to help us screen for potential risk and fraud, and to improve and optimize our site.' },
      { heading: 'Sharing Your Information', text: 'We share your Personal Information with third parties to help us process payments (Stripe), fulfill orders (shipping carriers), and provide analytics (Google Analytics). We do not sell your personal information to third parties.' },
      { heading: 'Your Rights', text: 'If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. You may contact us at privacy@atelier.com.' },
      { heading: 'Data Retention', text: 'When you place an order, we will maintain your order information for our records unless and until you ask us to delete this information.' },
    ],
  },
  '/terms': {
    title: 'Terms of Service',
    sections: [
      { heading: 'Overview', text: 'This website is operated by Atelier. Throughout the site, the terms "we," "us," and "our" refer to Atelier. By visiting our site and/or purchasing something from us, you engage in our service and agree to be bound by the following terms.' },
      { heading: 'General Conditions', text: 'We reserve the right to refuse service to anyone for any reason at any time. You understand that your content may be transferred unencrypted. Products are available exclusively online through our website.' },
      { heading: 'Accuracy of Information', text: 'We are not responsible if information on this site is not accurate, complete, or current. The material is provided for general information only and should not be relied upon as the sole basis for making decisions.' },
      { heading: 'Products and Pricing', text: 'Prices for our products are subject to change without notice. We reserve the right to modify or discontinue products at any time. We shall not be liable to you for any modification, price change, suspension, or discontinuance.' },
      { heading: 'Purchases', text: 'We reserve the right to limit the quantities of any products we offer. All descriptions of products and pricing are subject to change at any time without notice, at our sole discretion.' },
      { heading: 'Contact', text: 'Questions about the Terms of Service should be sent to us at legal@atelier.com.' },
    ],
  },
}

export default function ContentPages() {
  const { pathname } = useLocation()
  const page = pages[pathname]

  if (!page) return null

  return (
    <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-10 sm:mb-14">{page.title}</h1>
      <div className="space-y-10 sm:space-y-14">
        {page.sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-base sm:text-lg font-semibold text-white/70 mb-3">{s.heading}</h2>
            <p className="text-sm text-white/30 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
