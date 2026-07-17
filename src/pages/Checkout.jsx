import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { paymentApi } from '../api/api'
import { emailRegex } from '../utils/validate'
import Reveal from '../components/Reveal'

export default function Checkout() {
  const { items, total, count, clearCart } = useCart()
  const { currentUser } = useAuth()
  const { addresses, addAddress, updateAddress, deleteAddress } = useData()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
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
    country: 'India',
  })

  const [addressMode, setAddressMode] = useState('select')
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    full_name: `${currentUser?.name || ''}`,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'India',
    is_default: addresses.length === 0,
  })
  const [editingAddress, setEditingAddress] = useState(null)

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.is_default) || addresses[0]
      setSelectedAddressId(def.id)
      applyAddress(def)
    }
  }, [addresses])

  const applyAddress = (addr) => {
    const parts = addr.full_name.split(' ')
    setShipping({
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: currentUser?.email || '',
      address: addr.address_line1 + (addr.address_line2 ? `, ${addr.address_line2}` : ''),
      city: addr.city,
      state: addr.state,
      zip: addr.zip_code,
      country: addr.country,
    })
  }

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id)
    applyAddress(addr)
    setAddressMode('select')
  }

  const handleSaveAddress = async () => {
    if (!addressForm.address_line1.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.zip_code.trim()) return
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressForm)
      } else {
        const newAddr = await addAddress(addressForm)
        setSelectedAddressId(newAddr.id)
        applyAddress(newAddr)
      }
      setAddressMode('select')
      setEditingAddress(null)
      resetAddressForm()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditAddress = (addr) => {
    setEditingAddress(addr)
    setAddressForm({
      label: addr.label,
      full_name: addr.full_name,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || '',
      city: addr.city,
      state: addr.state,
      zip_code: addr.zip_code,
      country: addr.country,
      is_default: addr.is_default,
    })
    setAddressMode('edit')
  }

  const handleDeleteAddress = async (addr) => {
    await deleteAddress(addr.id)
    if (selectedAddressId === addr.id && addresses.length > 1) {
      const next = addresses.find((a) => a.id !== addr.id)
      setSelectedAddressId(next.id)
      applyAddress(next)
    }
  }

  const resetAddressForm = () => {
    setAddressForm({
      label: 'Home',
      full_name: `${currentUser?.name || ''}`,
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'India',
      is_default: false,
    })
    setEditingAddress(null)
  }

  const shippingCost = total >= 10000 ? 0 : 500
  const tax = total * 0.08
  const grandTotal = total + shippingCost + tax

  if (items.length === 0) {
    return (
      <Reveal>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-sm text-white/30 mb-6">Your bag is empty</p>
          <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-xs tracking-[0.2em] uppercase text-white/50 hover:bg-white hover:text-black transition-all duration-500">
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
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePlaceOrder = async () => {
    if (isPlacing) return
    setIsPlacing(true)
    setServerError(null)

    const loaded = await loadRazorpayScript()
    if (!loaded) {
      setServerError('Failed to load payment gateway. Please try again.')
      setIsPlacing(false)
      return
    }

    const address = `${shipping.firstName} ${shipping.lastName}, ${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}`
    const orderItems = items.map((item) => ({
      product_id: String(item.id),
      quantity: item.quantity,
    }))

    try {
      const { order_id, amount, currency, key_id } = await paymentApi.createOrder(address, orderItems)

      const options = {
        key: key_id,
        amount,
        currency,
        name: 'Atelier',
        description: `Order - ${items.length} item(s)`,
        order_id,
        handler: async (response) => {
          try {
            await paymentApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shipping_address: address,
              items: orderItems,
            })
            clearCart()
            navigate(`/order-success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`)
          } catch (err) {
            setServerError('Payment verification failed. Contact support.')
            setIsPlacing(false)
          }
        },
        prefill: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          email: shipping.email,
        },
        theme: { color: '#0a0a0a' },
        modal: { ondismiss: () => { setIsPlacing(false) } },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Failed to start checkout. Please try again.')
      setIsPlacing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-10 sm:mb-16">Checkout</h1>
      </Reveal>

      <Reveal delay={60}>
        <div className="flex items-center gap-2 sm:gap-3 mb-10 sm:mb-12 overflow-x-auto pb-2">
          {['Shipping', 'Review'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[0.6rem] ${step > i + 1 ? 'bg-white text-black' : step === i + 1 ? 'bg-[#141414] text-white/70 border border-white/20' : 'bg-[#141414] text-white/30 border border-white/10'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${step === i + 1 ? 'text-white/50' : 'text-white/30'}`}>{label}</span>
              {i < 1 && <div className="w-4 sm:w-8 h-px bg-[#141414]" />}
            </div>
          ))}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
        <div className="lg:col-span-2">
          {step === 1 && (
            <Reveal>
              <div className="space-y-5">
                <h2 className="text-lg font-medium text-white/50 mb-6">Shipping Information</h2>

                {addresses.length > 0 && addressMode === 'select' && (
                  <div className="bg-[#141414] rounded-lg border border-white/10 p-4 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/30">Saved Addresses</p>
                      <button onClick={() => { resetAddressForm(); setAddressMode('new') }} className="text-[0.6rem] text-white/30 hover:text-white/50 transition-colors">
                        + Add New
                      </button>
                    </div>
                    <div className="space-y-2">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-white/20 bg-white/[0.03]' : 'border-white/10 hover:border-white/15'}`}
                          onClick={() => handleSelectAddress(addr)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs text-white/50 font-medium">{addr.label}</p>
                                {addr.is_default && <span className="text-[0.5rem] text-[#4ade80]/60 bg-[#4ade80]/10 px-1.5 py-0.5 rounded">Default</span>}
                              </div>
                              <p className="text-[0.6rem] text-white/30">{addr.full_name}</p>
                              <p className="text-[0.6rem] text-white/30">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                              <p className="text-[0.6rem] text-white/30">{addr.city}, {addr.state} {addr.zip_code}</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button onClick={(e) => { e.stopPropagation(); handleEditAddress(addr) }} className="px-2 py-1 text-[0.55rem] text-white/30 hover:text-white/50 border border-white/10 hover:border-white/20 transition-colors">Edit</button>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr) }} className="px-2 py-1 text-[0.55rem] text-red-400/50 hover:text-red-400/80 border border-white/10 hover:border-red-400/20 transition-colors">Del</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(addressMode === 'new' || addressMode === 'edit' || addresses.length === 0) && (
                  <div className="bg-[#141414] rounded-lg border border-white/10 p-4 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/30">{editingAddress ? 'Edit Address' : 'New Address'}</p>
                      {addresses.length > 0 && (
                        <button onClick={() => { setAddressMode('select'); setEditingAddress(null) }} className="text-[0.6rem] text-white/30 hover:text-white/50 transition-colors">
                          ← Back to saved
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.6rem] text-white/30 mb-1">Label</label>
                        <select value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors">
                          <option>Home</option>
                          <option>Work</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[0.6rem] text-white/30 mb-1">Full Name</label>
                        <input value={addressForm.full_name} onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })} className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[0.6rem] text-white/30 mb-1">Address Line 1</label>
                      <input value={addressForm.address_line1} onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })} className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[0.6rem] text-white/30 mb-1">Address Line 2 <span className="text-white/20">(optional)</span></label>
                      <input value={addressForm.address_line2} onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })} className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[0.6rem] text-white/30 mb-1">City</label>
                        <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[0.6rem] text-white/30 mb-1">State</label>
                        <input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[0.6rem] text-white/30 mb-1">ZIP</label>
                        <input value={addressForm.zip_code} onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })} className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={addressForm.is_default} onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-[#141414] text-white/50 focus:ring-white/20" />
                      <span className="text-[0.6rem] text-white/30">Set as default address</span>
                    </label>
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleSaveAddress} className="px-5 py-2.5 bg-white text-black text-xs tracking-[0.1em] uppercase hover:bg-white/90 transition-colors min-h-[40px]">
                        {editingAddress ? 'Update' : 'Save Address'}
                      </button>
                      {addresses.length > 0 && (
                        <button onClick={() => { setAddressMode('select'); setEditingAddress(null) }} className="px-5 py-2.5 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[40px]">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.6rem] text-white/30 mb-1.5">First Name</label>
                      <input value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.firstName ? 'border-red-500/50' : 'border-white/10'}`} />
                      {errors.firstName && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-[0.6rem] text-white/30 mb-1.5">Last Name</label>
                      <input value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.lastName ? 'border-red-500/50' : 'border-white/10'}`} />
                      {errors.lastName && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.6rem] text-white/30 mb-1.5">Email</label>
                    <input type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.email ? 'border-red-500/50' : 'border-white/10'}`} />
                    {errors.email && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[0.6rem] text-white/30 mb-1.5">Address</label>
                    <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.address ? 'border-red-500/50' : 'border-white/10'}`} />
                    {errors.address && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[0.6rem] text-white/30 mb-1.5">City</label>
                      <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.city ? 'border-red-500/50' : 'border-white/10'}`} />
                      {errors.city && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-[0.6rem] text-white/30 mb-1.5">State</label>
                      <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.state ? 'border-red-500/50' : 'border-white/10'}`} />
                      {errors.state && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-[0.6rem] text-white/30 mb-1.5">ZIP</label>
                      <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.zip ? 'border-red-500/50' : 'border-white/10'}`} />
                      {errors.zip && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.zip}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button onClick={handleNext} className="px-8 py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors min-h-[48px]">
                      Review Order
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {step === 2 && (
            <Reveal>
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-white/50 mb-6">Review Order</h2>
                <div className="bg-[#141414] p-5 sm:p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-[0.6rem] text-white/30 mb-1">Shipping to</p>
                    <p className="text-sm text-white/50">{shipping.firstName} {shipping.lastName}</p>
                    <p className="text-xs text-white/30">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-[0.6rem] text-white/30 mb-1">Payment</p>
                    <p className="text-sm text-white/50">Razorpay secure checkout</p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-[0.6rem] text-white/30 mb-3">Items</p>
                    {items.map((item) => (
                      <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between text-sm py-2">
                        <span className="text-white/50">{item.name} × {item.quantity}</span>
                        <span className="text-white/30">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {serverError && <p className="text-xs text-red-400/70" role="alert">{serverError}</p>}
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="px-6 py-3.5 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[48px]">
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="px-8 py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors min-h-[48px] disabled:opacity-50"
                  >
                    {isPlacing ? 'Processing...' : 'Pay with Razorpay'}
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
                    <div className="w-12 h-14 rounded flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: item.color || '#141414' }}>
                      <span className="text-[0.4rem] tracking-[0.15em] uppercase text-white/25 text-center px-0.5">{item.name}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/50 truncate">{item.name}</p>
                      <p className="text-[0.6rem] text-white/30">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs text-white/30 flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Subtotal</span>
                  <span className="text-white/50">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Shipping</span>
                  <span className="text-white/50">{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Tax</span>
                  <span className="text-white/50">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Total</span>
                    <span className="text-base font-medium text-white/70">₹{grandTotal.toFixed(2)}</span>
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
