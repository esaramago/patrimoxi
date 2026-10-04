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
  default: async ({ params, request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login')
    }

    const formData = await request.formData()
    const name = ((formData.get('name') as string) || '').trim()
    const currency = (((formData.get('currency') as string) || 'EUR').trim()).toUpperCase()
    const notes = ((formData.get('notes') as string) || '').trim()

    const activeRaw = formData.get('active_value') ?? formData.get('active')
    const active = activeRaw === 'true' || activeRaw === 'on'

    if (!name) {
      return fail(400, { message: 'Account name is required.' })
    }

    if (!currency || currency.length !== 3) {
      return fail(400, { message: 'Currency must be a valid 3-letter code (e.g. EUR, USD).' })
    }

    try {
      await locals.pb.collection('accounts').update(params.id, {
        name,
        currency,
        active,
        notes
      })
    } catch (err: unknown) {
      const e = err as { message?: string }
      return fail(400, { message: e?.message || 'Failed to update account.' })
    }

    throw redirect(303, `/accounts/${params.id}`)
  }
}
