import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/api'
import Reveal from '../components/Reveal'
import PasswordInput from '../components/PasswordInput'

export default function Profile() {
  const { currentUser, updateUser } = useAuth()
  const [name, setName] = useState(currentUser?.name || '')
  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  if (!currentUser) {
    return (
      <Reveal>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-sm text-white/30 mb-6">Sign in to view your profile</p>
          <Link to="/login" className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-xs tracking-[0.2em] uppercase text-white/50 hover:bg-white hover:text-black transition-all duration-500">
            Sign In
          </Link>
        </div>
      </Reveal>
    )
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const data = {}
      if (name.trim()) data.name = name.trim()
      if (phone.trim()) data.phone = phone.trim()
      const updated = await authApi.updateProfile(data)
      updateUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordSaved(false)
    setPasswordError('')
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password must be different')
      return
    }
    setChangingPassword(true)
    try {
      await authApi.changePassword({ current_password: currentPassword, new_password: newPassword })
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 3000)
    } catch (err) {
      setPasswordError(err.response?.data?.detail || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-10 sm:mb-16">Profile</h1>
      </Reveal>

      <Reveal delay={40}>
        <div className="bg-[#141414] rounded-lg border border-white/10 p-6 sm:p-8 mb-6">
          <h2 className="text-sm font-medium text-white/50 mb-6">Personal Information</h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="text-[0.6rem] text-white/30 mb-1.5 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-xs text-white/50 focus:outline-none focus:border-white/20 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[0.6rem] text-white/30 mb-1.5 block">Email</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-xs text-white/30 cursor-not-allowed"
              />
              <p className="text-[0.55rem] text-white/20 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="text-[0.6rem] text-white/30 mb-1.5 block">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-xs text-white/50 focus:outline-none focus:border-white/20 transition-colors"
                placeholder="10-digit phone number"
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {saved && <p className="text-xs text-[#4ade80]">Profile updated</p>}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-white text-black text-xs tracking-[0.1em] uppercase hover:bg-white/90 transition-colors disabled:opacity-50 min-h-[40px]"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="bg-[#141414] rounded-lg border border-white/10 p-6 sm:p-8">
          <h2 className="text-sm font-medium text-white/50 mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-[0.6rem] text-white/30 mb-1.5 block">Current Password</label>
              <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="Enter current password" />
            </div>
            <div>
              <label className="text-[0.6rem] text-white/30 mb-1.5 block">New Password</label>
              <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="Enter new password" />
            </div>
            <div>
              <label className="text-[0.6rem] text-white/30 mb-1.5 block">Confirm New Password</label>
              <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm new password" />
            </div>
            {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
            {passwordSaved && <p className="text-xs text-[#4ade80]">Password updated</p>}
            <button
              type="submit"
              disabled={changingPassword}
              className="px-6 py-3 bg-white text-black text-xs tracking-[0.1em] uppercase hover:bg-white/90 transition-colors disabled:opacity-50 min-h-[40px]"
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </Reveal>
    </div>
  )
}
