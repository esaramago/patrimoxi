import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Account } from '@/types/account'

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login')
  }

  try {
    const record = await locals.pb.collection('accounts').getOne(params.id)
    return {
      account: record as unknown as Account
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
  }
}
