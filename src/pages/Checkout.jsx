import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { emailRegex } from '../utils/validate'
import Reveal from '../components/Reveal'

export default function Checkout() {
  const { items, total, count, clearCart } = useCart()
  const { currentUser } = useAuth()
  const { addOrder } = useData()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [isPlacing, setIsPlacing] = useState(false)

  const [shipping, setShipping] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  })

  const [payment, setPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  })

  const shippingCost = total >= 200 ? 0 : 15
  const tax = total * 0.08
  const grandTotal = total + shippingCost + tax

  if (items.length === 0 && !submitted) {
    return (
      <Reveal>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-sm text-white/20 mb-6">Your bag is empty</p>
          <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 border border-white/15 text-xs tracking-[0.2em] uppercase text-white/60 hover:bg-white hover:text-black transition-all duration-500">
            Browse the collection
          </Link>
        </div>
      </Reveal>
    )
  }

  const validateStep1 = () => {
    const errs = {}
    if (!shipping.firstName.trim()) errs.firstName = 'Required'
    if (!shipping.lastName.trim()) errs.lastName = 'Required'
    if (!shipping.email.trim()) errs.email = 'Required'
    else if (!emailRegex.test(shipping.email)) errs.email = 'Invalid email'
    if (!shipping.address.trim()) errs.address = 'Required'
    if (!shipping.city.trim()) errs.city = 'Required'
    if (!shipping.state.trim()) errs.state = 'Required'
    if (!shipping.zip.trim()) errs.zip = 'Required'
    else if (!/^\d{5}(-\d{4})?$/.test(shipping.zip)) errs.zip = 'Invalid ZIP'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    const errs = {}
    if (!payment.cardNumber.trim()) errs.cardNumber = 'Required'
    else if (payment.cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Invalid card'
    if (!payment.cardName.trim()) errs.cardName = 'Required'
    if (!payment.expiry.trim()) errs.expiry = 'Required'
    else if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) errs.expiry = 'MM/YY'
    if (!payment.cvc.trim()) errs.cvc = 'Required'
    else if (!/^\d{3,4}$/.test(payment.cvc)) errs.cvc = 'Invalid'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const handlePlaceOrder = async () => {
    if (isPlacing) return
    setIsPlacing(true)
    const address = `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}`
    const orderItems = items.map((item) => ({
      product_id: String(item.id),
      quantity: item.quantity,
    }))
    try {
      await addOrder(address, orderItems)
      clearCart()
      setSubmitted(true)
    } catch (err) {
      setServerError('Failed to place order. Please try again.')
    } finally {
      setIsPlacing(false)
    }
  }

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  if (submitted) {
    return (
      <Reveal>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] mb-3">Order Placed</h1>
          <p className="text-sm text-white/30 mb-2">Thank you for your purchase.</p>
          <p className="text-xs text-white/20 mb-8">A confirmation has been sent to {shipping.email}.</p>
          <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </Reveal>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-10 sm:mb-16">Checkout</h1>
      </Reveal>

      <Reveal delay={60}>
        <div className="flex items-center gap-2 sm:gap-3 mb-10 sm:mb-12 overflow-x-auto pb-2">
          {['Shipping', 'Payment', 'Review'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[0.6rem] ${step > i + 1 ? 'bg-white text-black' : step === i + 1 ? 'bg-white/10 text-white/70 border border-white/20' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${step === i + 1 ? 'text-white/60' : 'text-white/20'}`}>{label}</span>
              {i < 2 && <div className="w-4 sm:w-8 h-px bg-white/5" />}
            </div>
          ))}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
        <div className="lg:col-span-2">
          {step === 1 && (
            <Reveal>
              <div className="space-y-5">
                <h2 className="text-lg font-medium text-white/60 mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.6rem] text-white/25 mb-1.5">First Name</label>
                    <input value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.firstName ? 'border-red-500/50' : 'border-white/10'}`} />
                    {errors.firstName && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-[0.6rem] text-white/25 mb-1.5">Last Name</label>
                    <input value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.lastName ? 'border-red-500/50' : 'border-white/10'}`} />
                    {errors.lastName && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-[0.6rem] text-white/25 mb-1.5">Email</label>
                  <input type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.email ? 'border-red-500/50' : 'border-white/10'}`} />
                  {errors.email && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-[0.6rem] text-white/25 mb-1.5">Address</label>
                  <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.address ? 'border-red-500/50' : 'border-white/10'}`} />
                  {errors.address && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[0.6rem] text-white/25 mb-1.5">City</label>
                    <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.city ? 'border-red-500/50' : 'border-white/10'}`} />
                    {errors.city && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-[0.6rem] text-white/25 mb-1.5">State</label>
                    <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.state ? 'border-red-500/50' : 'border-white/10'}`} />
                    {errors.state && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-[0.6rem] text-white/25 mb-1.5">ZIP</label>
                    <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.zip ? 'border-red-500/50' : 'border-white/10'}`} />
                    {errors.zip && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.zip}</p>}
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={handleNext} className="px-8 py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors min-h-[48px]">
                    Continue to Payment
                  </button>
                </div>
              </div>
            </Reveal>
          )}

          {step === 2 && (
            <Reveal>
              <div className="space-y-5">
                <h2 className="text-lg font-medium text-white/60 mb-6">Payment Details</h2>
                <div>
                  <label className="block text-[0.6rem] text-white/25 mb-1.5">Card Number</label>
                  <input
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 placeholder-white/15 focus:outline-none focus:border-white/20 transition-colors ${errors.cardNumber ? 'border-red-500/50' : 'border-white/10'}`}
                  />
                  {errors.cardNumber && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label className="block text-[0.6rem] text-white/25 mb-1.5">Name on Card</label>
                  <input value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.cardName ? 'border-red-500/50' : 'border-white/10'}`} />
                  {errors.cardName && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.cardName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.6rem] text-white/25 mb-1.5">Expiry</label>
                    <input
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 placeholder-white/15 focus:outline-none focus:border-white/20 transition-colors ${errors.expiry ? 'border-red-500/50' : 'border-white/10'}`}
                    />
                    {errors.expiry && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-[0.6rem] text-white/25 mb-1.5">CVC</label>
                    <input
                      value={payment.cvc}
                      onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 placeholder-white/15 focus:outline-none focus:border-white/20 transition-colors ${errors.cvc ? 'border-red-500/50' : 'border-white/10'}`}
                    />
                    {errors.cvc && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.cvc}</p>}
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="px-6 py-3.5 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[48px]">
                    Back
                  </button>
                  <button onClick={handleNext} className="px-8 py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors min-h-[48px]">
                    Review Order
                  </button>
                </div>
              </div>
            </Reveal>
          )}

          {step === 3 && (
            <Reveal>
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-white/60 mb-6">Review Order</h2>
                <div className="bg-[#141414] p-5 sm:p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-[0.6rem] text-white/25 mb-1">Shipping to</p>
                    <p className="text-sm text-white/60">{shipping.firstName} {shipping.lastName}</p>
                    <p className="text-xs text-white/30">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                  </div>
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-[0.6rem] text-white/25 mb-1">Payment</p>
                    <p className="text-sm text-white/60">Card ending in {payment.cardNumber.replace(/\s/g, '').slice(-4)}</p>
                  </div>
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-[0.6rem] text-white/25 mb-3">Items</p>
                    {items.map((item) => (
                      <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between text-sm py-2">
                        <span className="text-white/50">{item.name} × {item.quantity}</span>
                        <span className="text-white/40">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {serverError && <p className="text-xs text-red-400/70" role="alert">{serverError}</p>}
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(2)} className="px-6 py-3.5 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[48px]">
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="px-8 py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors min-h-[48px] disabled:opacity-50"
                  >
                    {isPlacing ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal direction="right">
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="bg-[#141414] p-5 sm:p-6 rounded-lg lg:sticky lg:top-24">
              <h2 className="text-sm font-medium text-white/50 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3">
                    <div className="w-12 h-14 rounded flex-shrink-0 flex items-center justify-center text-white/10" style={{ background: item.color }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/50 truncate">{item.name}</p>
                      <p className="text-[0.6rem] text-white/20">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs text-white/40 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Subtotal</span>
                  <span className="text-white/50">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Shipping</span>
                  <span className="text-white/50">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Tax</span>
                  <span className="text-white/50">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/5 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Total</span>
                    <span className="text-base font-medium text-white/80">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
