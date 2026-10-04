import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Account } from '@/types/account'
import type { Transaction } from '@/types/transaction'

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login')
  }

  try {
    const [accountRecord, transactionRecords] = await Promise.all([
      locals.pb.collection('accounts').getOne(params.id),
      locals.pb.collection('transactions').getFullList({
        filter: `account = "${params.id}"`,
        sort: '-date,-created'
      })
    ])

    return {
      account: accountRecord as unknown as Account,
      transactions: transactionRecords as unknown as Transaction[]
    }
  } catch {
    throw error(404, 'Account not found')
  }
}

export const actions: Actions = {
  toggleActive: async ({ params, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login')
    }

    try {
      const account = await locals.pb.collection('accounts').getOne(params.id)
      await locals.pb.collection('accounts').update(params.id, {
        active: !account.active
      })
      return { success: true }
    } catch (err: unknown) {
      const e = err as { message?: string }
      return fail(400, { message: e?.message || 'Failed to toggle account status.' })
    }
  },

  delete: async ({ params, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login')
    }

    try {
      await locals.pb.collection('accounts').delete(params.id)
    } catch (err: unknown) {
      const e = err as { message?: string }
      return fail(400, { message: e?.message || 'Failed to delete account.' })
    }

    throw redirect(303, '/accounts')
  },

  deleteTransaction: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login')
    }

    const formData = await request.formData()
    const id = formData.get('id') as string

    if (!id) {
      return fail(400, { message: 'Transaction ID is required.' })
    }

    try {
      await locals.pb.collection('transactions').delete(id)
      return { success: true }
    } catch (err: unknown) {
      const e = err as { message?: string }
      return fail(400, { message: e?.message || 'Failed to delete transaction.' })
    }
  }
}
