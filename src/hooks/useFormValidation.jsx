import { useState, useCallback } from 'react'

const VALIDATORS = {
  required: (v) => !v || (typeof v === 'string' && !v.trim()) ? 'This field is required' : null,
  email: (v) => !v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email' : null,
  minLength: (min) => (v) => !v || v.length < min ? `Must be at least ${min} characters` : null,
  maxLength: (max) => (v) => !v || v.length > max ? `Must be at most ${max} characters` : null,
  match: (field, label) => (v, all) => v !== all[field] ? `${label} must match` : null,
  phone: (v) => !v || !/^[\d\s\-+()]{7,}$/.test(v) ? 'Enter a valid phone number' : null,
  zip: (v) => !v || !/^\d{5}(-\d{4})?$/.test(v) ? 'Enter a valid ZIP code' : null,
  cardNumber: (v) => !v || !/^\d{13,19}$/.test(v.replace(/\s/g, '')) ? 'Enter a valid card number' : null,
  expiry: (v) => !v || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ? 'Use MM/YY format' : null,
  cvc: (v) => !v || !/^\d{3,4}$/.test(v) ? 'Enter a valid CVC' : null,
}

export function useFormValidation(schema) {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = useCallback((values) => {
    const newErrors = {}
    let valid = true

    for (const [field, rules] of Object.entries(schema)) {
      const value = values[field]
      for (const rule of rules) {
        const error = typeof rule === 'function' ? rule(value, values) : VALIDATORS[rule]?.(value)
        if (error) {
          newErrors[field] = error
          valid = false
          break
        }
      }
    }

    setErrors(newErrors)
    return valid
  }, [schema])

  const touch = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const getFieldProps = useCallback((field, value, onChange) => ({
    value,
    onChange: (e) => {
      onChange(e.target.value)
      if (touched[field]) validate({ [field]: e.target.value })
    },
    onBlur: () => {
      touch(field)
      if (touched[field]) validate({ [field]: value })
    },
    'aria-invalid': touched[field] && errors[field] ? 'true' : undefined,
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  }), [touched, errors, touch, validate])

  return { errors, touched, validate, touch, getFieldProps }
}

export function ValidationMessage({ field, errors, touched }) {
  if (!touched[field] || !errors[field]) return null
  return (
    <p id={`${field}-error`} className="text-xs text-[#c85a3e] mt-1.5" role="alert">
      {errors[field]}
    </p>
  )
}
