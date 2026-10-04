import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/')
	}
}

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		if (!email || !password) {
			return fail(400, { email, message: 'Email and password are required.' })
		}

		try {
			await locals.pb.collection('users').authWithPassword(email, password)
		} catch (err: unknown) {
			const error = err as { message?: string }
			return fail(400, { email, message: error?.message || 'Invalid email or password.' })
		}

		throw redirect(303, '/')
	}
}
