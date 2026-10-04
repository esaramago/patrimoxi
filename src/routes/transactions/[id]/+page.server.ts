import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Transaction } from '@/types/transaction'

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login')
  }

  try {
    const record = await locals.pb.collection('transactions').getOne(params.id, {
      expand: 'account'
    })
    return {
      transaction: record as unknown as Transaction
    }
  } catch {
    throw error(404, 'Transaction not found')
  }
}

export const actions: Actions = {
  delete: async ({ params, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login')
    }

    try {
      await locals.pb.collection('transactions').delete(params.id)
    } catch (err: unknown) {
      const e = err as { message?: string }
      return fail(400, { message: e?.message || 'Failed to delete transaction.' })
    }

    throw redirect(303, '/transactions')
  }
}
