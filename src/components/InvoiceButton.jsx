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
      a.download = `ecom-demo-invoice-${order.id.slice(0, 8)}.pdf`
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

  const handlePrint = async (e) => {
    e.stopPropagation()
    if (generating) return
    setGenerating(true)
    try {
      const blob = await pdf(<InvoicePDF order={order} />).toBlob()
      const url = URL.createObjectURL(blob)
      const printWindow = window.open(url, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    } catch (err) {
      console.error('Failed to generate invoice for print:', err)
    } finally {
      setGenerating(false)
    }
  }

  if (variant === 'admin') {
    return (
      <div className="flex items-center gap-2">
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
          {generating ? 'Generating...' : 'Download'}
        </button>
        <button
          onClick={handlePrint}
          disabled={generating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded text-[0.6rem] text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[32px] disabled:opacity-50"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
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
      <button
        onClick={handlePrint}
        disabled={generating}
        className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[40px] disabled:opacity-50"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Print Invoice
      </button>
    </div>
  )
}
