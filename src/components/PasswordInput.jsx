import { useState } from 'react'

export default function PasswordInput({ value, onChange, placeholder, autoComplete, className = '', error }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 pr-11 bg-[#141414] border text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors ${error ? 'border-red-500/50' : 'border-white/10'} ${className}`}
      />
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); setShow((s) => !s) }}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center cursor-pointer"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/30 hover:text-white/50 transition-colors">
          {show ? (
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>
    </div>
  )
}
