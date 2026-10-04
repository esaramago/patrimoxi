import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login')
  }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
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

    let createdId: string
    try {
      const record = await locals.pb.collection('accounts').create({
        name,
        currency,
        active,
        notes,
        user: locals.user.id
      })
      createdId = record.id
    } catch (err: unknown) {
      const e = err as { message?: string }
      return fail(400, { message: e?.message || 'Failed to create account.' })
    }

    throw redirect(303, `/accounts/${createdId}`)
  }
}
