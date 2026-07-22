import { useState } from 'react'

const statusColors = {
  pending: 'bg-yellow-400/10 text-yellow-400/70 border-yellow-400/20',
  processing: 'bg-blue-400/10 text-blue-400/70 border-blue-400/20',
  shipped: 'bg-purple-400/10 text-purple-400/70 border-purple-400/20',
  delivered: 'bg-[#4ade80]/10 text-[#4ade80]/70 border-[#4ade80]/20',
  cancelled: 'bg-red-400/10 text-red-400/70 border-red-400/20',
}

export { statusColors }
