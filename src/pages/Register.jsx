import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { emailRegex } from '../utils/validate'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', adminKey: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!emailRegex.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'At least 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    const result = await register(form.name, form.email, form.password, form.adminKey)
    setLoading(false)
    if (result.success) {
      navigate(result.isAdmin ? '/admin' : '/')
    } else {
      setServerError(result.error || 'Registration failed')
    }
  }

  return (
    <div className="animate-fade-in min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-[-0.03em] mb-2">Create account</h1>
          <p className="text-sm text-white/30">Join Atelier</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[0.6rem] text-white/25 mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); setServerError('') }}
              className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.name ? 'border-red-500/50' : 'border-white/10'}`}
              autoComplete="name"
            />
            {errors.name && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[0.6rem] text-white/25 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); setServerError('') }}
              className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
              autoComplete="email"
            />
            {errors.email && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[0.6rem] text-white/25 mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); setServerError('') }}
              className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.password ? 'border-red-500/50' : 'border-white/10'}`}
              autoComplete="new-password"
            />
            {errors.password && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-[0.6rem] text-white/25 mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }) }}
              className={`w-full px-4 py-3 bg-white/5 border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'}`}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.confirmPassword}</p>}
          </div>

          <div className="border-t border-white/5 pt-5">
            <label className="block text-[0.6rem] text-white/25 mb-1.5">Admin Secret Key <span className="text-white/10">(optional)</span></label>
            <input
              type="text"
              value={form.adminKey}
              onChange={(e) => setForm({ ...form, adminKey: e.target.value })}
              placeholder="Leave blank for customer account"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-sm text-white/70 placeholder-white/15 focus:outline-none focus:border-white/20 transition-colors"
            />
            <p className="text-[0.55rem] text-white/15 mt-1">Requires valid admin secret key to create admin account</p>
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

        <p className="text-center text-xs text-white/20 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-white/40 hover:text-white/60 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
