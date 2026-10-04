import type { TransactionType } from '@/types/transaction'

export function formatDate(isoString: string): string {
  if (!isoString) return '—'
  try {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return isoString
  }
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '—'
  try {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return isoString
  }
}

export function formatDateForInput(isoString?: string): string {
  if (!isoString) {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  try {
    return new Date(isoString).toISOString().split('T')[0]
  } catch {
    return ''
  }
}

export function formatAmount(amount: number, currency: string = 'EUR'): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'EUR'
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

export function getTransactionTypeBadgeVariant(
  type: TransactionType
): 'success' | 'danger' | 'brand' | 'neutral' | 'warning' {
  switch (type) {
    case 'deposit':
    case 'dividend':
    case 'interest':
      return 'success'
    case 'withdrawal':
    case 'fee':
      return 'danger'
    case 'buy':
      return 'brand'
    case 'sell':
      return 'warning'
    case 'transfer':
    default:
      return 'neutral'
  }
}

export function formatTransactionTypeName(type: TransactionType): string {
  if (!type) return ''
  return type.charAt(0).toUpperCase() + type.slice(1)
}
