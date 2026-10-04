import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Account } from '@/types/account'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login')
  }

  try {
    const records = await locals.pb.collection('accounts').getFullList({
      sort: '-active,name'
    })

    return {
      accounts: records as unknown as Account[]
    }
  } catch (err: unknown) {
    const e = err as { message?: string }
    return {
      accounts: [] as Account[],
      error: e?.message || 'Failed to fetch accounts.'
    }
  }
}

export const actions: Actions = {
  toggleActive: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login')
    }

    const formData = await request.formData()
    const id = formData.get('id') as string

    if (!id) {
      return fail(400, { message: 'Account ID is required.' })
    }

    try {
      const account = await locals.pb.collection('accounts').getOne(id)
      await locals.pb.collection('accounts').update(id, {
        active: !account.active
      })
      return { success: true }
    } catch (err: unknown) {
      const e = err as { message?: string }
      return fail(400, { message: e?.message || 'Failed to toggle account status.' })
    }
  },

  delete: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login')
    }

    const formData = await request.formData()
    const id = formData.get('id') as string

    if (!id) {
      return fail(400, { message: 'Account ID is required.' })
    }

    try {
      await locals.pb.collection('accounts').delete(id)
      return { success: true }
    } catch (err: unknown) {
      const e = err as { message?: string }
      return fail(400, { message: e?.message || 'Failed to delete account.' })
    }
  }
}
