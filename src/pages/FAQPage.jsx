import Breadcrumbs from '../components/Breadcrumbs'

const FAQS = [
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can use this to track your package in real-time.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, PayPal, and buy-now-pay-later options through Klarna and Afterpay.',
  },
  {
    q: 'How do I start a return?',
    a: 'Log into your account, navigate to order history, and select the item you\'d like to return. You\'ll receive a prepaid return label to print.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship to over 50 countries. Duties and taxes are calculated at checkout so there are no surprise fees upon delivery.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 5–7 business days within the US. Express (2–3 days) and overnight options are also available.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be modified or cancelled within 2 hours of placement. After that, we begin processing for shipment. Contact us immediately if you need to make changes.',
  },
  {
    q: 'Are your products handmade?',
    a: 'Yes, every piece in our collection is crafted by hand by independent makers. Slight variations in each piece are a hallmark of genuine craftsmanship.',
  },
  {
    q: 'Do you offer gift wrapping?',
    a: 'We offer complimentary gift wrapping on all orders. Simply select the gift wrap option at checkout and add a personal message.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen py-8 px-8">
      <Breadcrumbs />
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25 mb-4">Help</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-6">Frequently Asked Questions</h1>
          <p className="text-sm text-white/35">Everything you need to know about shopping with Atelier.</p>
        </div>

        <div className="space-y-0">
          {FAQS.map((faq, i) => (
            <details key={i} className="group border-b border-white/5">
              <summary className="py-6 cursor-pointer text-sm text-white/70 font-medium flex items-center justify-between list-none">
                {faq.q}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/30 group-open:rotate-45 transition-transform flex-shrink-0 ml-4">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </summary>
              <p className="text-sm text-white/35 leading-relaxed pb-6">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-16 py-12 border-t border-white/5 text-center">
          <p className="text-sm text-white/30 mb-2">Still have questions?</p>
          <a href="mailto:hello@atelier.com" className="text-sm text-white/50 hover:text-white/70 transition-colors">
            Contact us at hello@atelier.com
          </a>
        </div>
      </div>
    </div>
  )
}
