import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { emailRegex } from '../utils/validate'
import PasswordInput from '../components/PasswordInput'
import Reveal from '../components/Reveal'

export default function Login() {
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!emailRegex.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.locked) {
      setServerError('Account temporarily locked due to too many failed attempts. Try again later.')
    } else if (result.success) {
      navigate(isAdmin ? '/admin' : '/')
    } else {
      setServerError(result.error || 'Invalid email or password')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Reveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-[-0.03em] mb-2">Welcome back</h1>
            <p className="text-sm text-white/30">Sign in to your account</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="block text-[0.6rem] text-white/30 mb-1.5">Password</label>
              <PasswordInput
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); setServerError('') }}
                autoComplete="current-password"
                error={errors.password}
              />
              {errors.password && <p className="text-[0.6rem] text-red-400/60 mt-1" role="alert">{errors.password}</p>}
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-center text-xs text-white/30 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-white/30 hover:text-white/50 transition-colors">Create one</Link>
          </p>
        </Reveal>
      </div>
    </div>
  )
}
