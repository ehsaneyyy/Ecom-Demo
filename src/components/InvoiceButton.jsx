import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import InvoicePDF from './InvoicePDF'

export default function InvoiceButton({ order, variant = 'admin' }) {
  const [generating, setGenerating] = useState(false)

  const handleDownload = async (e) => {
    e.stopPropagation()
    if (generating) return
    setGenerating(true)
    try {
      const blob = await pdf(<InvoicePDF order={order} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `atelier-invoice-${order.id.slice(0, 8)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to generate invoice:', err)
    } finally {
      setGenerating(false)
    }
  }

  if (variant === 'admin') {
    return (
      <button
        onClick={handleDownload}
        disabled={generating}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded text-[0.6rem] text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[32px] disabled:opacity-50"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {generating ? 'Generating...' : 'Invoice'}
      </button>
    )
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[40px] disabled:opacity-50"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {generating ? 'Generating...' : 'Download Invoice'}
    </button>
  )
}
