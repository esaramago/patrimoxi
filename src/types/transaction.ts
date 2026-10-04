import type { Account } from './account'

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'buy'
  | 'sell'
  | 'dividend'
  | 'interest'
  | 'fee'
  | 'transfer'

export interface Transaction {
  id: string
  account: string
  expand?: {
    account?: Account
  }
  type: TransactionType
  date: string
  amount: number
  currency?: string
  asset?: string
  quantity?: number
  unit_price?: number
  fee?: number
  tax?: number
  exchange_rate?: number
  notes?: string
  user?: string
  created: string
  updated: string
}
