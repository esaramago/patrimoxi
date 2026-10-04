import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Transaction } from '@/types/transaction'
import type { Account } from '@/types/account'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login')
  }

  try {
    const [transactions, accounts] = await Promise.all([
      locals.pb.collection('transactions').getFullList({
        sort: '-date,-created',
        expand: 'account'
      }),
      locals.pb.collection('accounts').getFullList({
        sort: '-active,name'
      })
    ])

    return {
      transactions: transactions as unknown as Transaction[],
      accounts: accounts as unknown as Account[]
    }
  } catch (err: unknown) {
    const e = err as { message?: string }
    return {
      transactions: [] as Transaction[],
      accounts: [] as Account[],
      error: e?.message || 'Failed to fetch transactions.'
    }
  }
}

export const actions: Actions = {
  delete: async ({ request, locals }) => {
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
