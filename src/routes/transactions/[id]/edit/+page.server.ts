import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Transaction } from '@/types/transaction'
import type { Account } from '@/types/account'

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login')
  }

  try {
    const [transaction, accounts] = await Promise.all([
      locals.pb.collection('transactions').getOne(params.id, {
        expand: 'account'
      }),
      locals.pb.collection('accounts').getFullList({
        sort: '-active,name'
      })
    ])

    return {
      transaction: transaction as unknown as Transaction,
      accounts: accounts as unknown as Account[]
    }
  } catch {
    throw error(404, 'Transaction not found')
  }
}

export const actions: Actions = {
  default: async ({ params, request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login')
    }

    const formData = await request.formData()
    const account = ((formData.get('account_value') ?? formData.get('account')) as string || '').trim()
    const type = ((formData.get('type_value') ?? formData.get('type')) as string || '').trim()
    const dateRaw = ((formData.get('date') as string) || '').trim()
    const amountRaw = (formData.get('amount_value') ?? formData.get('amount')) as string
    const currency = (((formData.get('currency') as string) || 'EUR').trim()).toUpperCase()
    const asset = ((formData.get('asset') as string) || '').trim()
    const quantityRaw = (formData.get('quantity_value') ?? formData.get('quantity')) as string
    const unitPriceRaw = (formData.get('unit_price_value') ?? formData.get('unit_price')) as string
    const feeRaw = (formData.get('fee_value') ?? formData.get('fee')) as string
    const taxRaw = (formData.get('tax_value') ?? formData.get('tax')) as string
    const exchangeRateRaw = (formData.get('exchange_rate_value') ?? formData.get('exchange_rate')) as string
    const notes = ((formData.get('notes') as string) || '').trim()

    if (!account) {
      return fail(400, { message: 'Account is required.' })
    }

    if (!type) {
      return fail(400, { message: 'Transaction type is required.' })
    }

    if (!dateRaw) {
      return fail(400, { message: 'Date is required.' })
    }

    let amount = Number(amountRaw)
    const quantity = quantityRaw && !isNaN(Number(quantityRaw)) ? Number(quantityRaw) : null
    const unitPrice = unitPriceRaw && !isNaN(Number(unitPriceRaw)) ? Number(unitPriceRaw) : null
    const fee = feeRaw && !isNaN(Number(feeRaw)) ? Number(feeRaw) : 0
    const tax = taxRaw && !isNaN(Number(taxRaw)) ? Number(taxRaw) : 0
    const exchangeRate =
      exchangeRateRaw && !isNaN(Number(exchangeRateRaw)) && Number(exchangeRateRaw) > 0
        ? Number(exchangeRateRaw)
        : 1

    // Deduce amount from quantity, unit price, fee, tax, and exchange rate if not directly specified
    if ((isNaN(amount) || amount === 0) && quantity != null && unitPrice != null) {
      const base = quantity * unitPrice * exchangeRate
      if (type === 'buy') {
        amount = base + fee + tax
      } else if (type === 'sell' || type === 'dividend' || type === 'interest') {
        amount = base - fee - tax
      } else {
        amount = base + fee + tax
      }
      amount = Math.round((amount + Number.EPSILON) * 100) / 100
    }

    if (isNaN(amount) || amount < 0) {
      return fail(400, { message: 'Valid amount is required.' })
    }

    let dateIso: string
    try {
      dateIso = new Date(dateRaw).toISOString()
    } catch {
      return fail(400, { message: 'Invalid date format.' })
    }

    const payload: Record<string, unknown> = {
      account,
      type,
      date: dateIso,
      amount,
      currency,
      notes,
      asset: asset || '',
      quantity,
      unit_price: unitPrice,
      fee: feeRaw && !isNaN(Number(feeRaw)) ? Number(feeRaw) : null,
      tax: taxRaw && !isNaN(Number(taxRaw)) ? Number(taxRaw) : null,
      exchange_rate: exchangeRateRaw && !isNaN(Number(exchangeRateRaw)) ? Number(exchangeRateRaw) : null
    }

    try {
      await locals.pb.collection('transactions').update(params.id, payload)
    } catch (err: unknown) {
      const e = err as { message?: string }
      return fail(400, { message: e?.message || 'Failed to update transaction.' })
    }

    throw redirect(303, `/transactions/${params.id}`)
  }
}
