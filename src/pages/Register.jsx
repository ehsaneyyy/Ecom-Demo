import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { emailRegex } from '../utils/validate'
import PasswordInput from '../components/PasswordInput'
import Reveal from '../components/Reveal'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', adminKey: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!emailRegex.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'At least 8 characters'
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Need an uppercase letter'
    else if (!/[a-z]/.test(form.password)) errs.password = 'Need a lowercase letter'
    else if (!/[0-9]/.test(form.password)) errs.password = 'Need a number'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    const name = `${form.firstName.trim()} ${form.lastName.trim()}`
    const result = await register(name, form.email, form.password, form.adminKey, form.phone)
    setLoading(false)
    if (result.success) {
      navigate(result.isAdmin ? '/admin' : '/')
    } else {
      setServerError(result.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Reveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-[-0.03em] mb-2">Create account</h1>
            <p className="text-sm text-white/30">Join Atelier</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.6rem] text-white/30 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => { setForm({ ...form, firstName: e.target.value }); setErrors({ ...errors, firstName: '' }); setServerError('') }}
                  className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.firstName ? 'border-red-500/50' : 'border-white/10'}`}
                  autoComplete="given-name"
                />
                {errors.firstName && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-[0.6rem] text-white/30 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => { setForm({ ...form, lastName: e.target.value }); setErrors({ ...errors, lastName: '' }); setServerError('') }}
                  className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.lastName ? 'border-red-500/50' : 'border-white/10'}`}
                  autoComplete="family-name"
                />
                {errors.lastName && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); setServerError('') }}
                className={`w-full px-4 py-3 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
                autoComplete="email"
              />
              {errors.email && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1.5">Phone Number <span className="text-white/20">(optional)</span></label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="98765 43210"
                className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-white/70 placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
                autoComplete="tel"
              />
            </div>

            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1.5">Password</label>
              <PasswordInput
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); setServerError('') }}
                autoComplete="new-password"
                error={errors.password}
              />
              {errors.password && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1.5">Confirm Password</label>
              <PasswordInput
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                autoComplete="new-password"
                error={errors.confirmPassword}
              />
              {errors.confirmPassword && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.confirmPassword}</p>}
            </div>

            <div className="border-t border-white/10 pt-5">
              <label className="block text-[0.6rem] text-white/30 mb-1.5">Admin Secret Key <span className="text-white/30">(optional)</span></label>
              <input
                type="text"
                value={form.adminKey}
                onChange={(e) => setForm({ ...form, adminKey: e.target.value })}
                placeholder="Leave blank for customer account"
                className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-white/70 placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
              />
              <p className="text-[0.55rem] text-white/30 mt-1">Requires valid admin secret key to create admin account</p>
            </div>

            {serverError && (
              <p className="text-xs text-red-400/70 bg-red-400/5 border border-red-400/10 rounded-lg px-4 py-3" role="alert">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase text-center hover:bg-white/90 transition-colors disabled:opacity-50 min-h-[48px]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-center text-xs text-white/30 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-white/30 hover:text-white/50 transition-colors">Sign in</Link>
          </p>
        </Reveal>
      </div>
    </div>
  )
}
