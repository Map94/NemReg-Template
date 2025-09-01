'use server'

import { publicAction } from '@/lib/safe-action'
import { tryCatch } from '@/lib/try-catch'
import { signInValidation, signUpValidation } from '@/schemas/auth'
import { getServerSchema } from '@/schemas/utils'
import { authService } from '@/service/auth/service'
import { SessionPlatform } from '@/store/auth/models'
import { AuthErrorCode, StoreError } from '@/store/error'
import { flattenValidationErrors } from 'next-safe-action'

async function getSignUpSchema() {
	return getServerSchema(signUpValidation, 'validation')
}

export const signUpAction = publicAction
	.metadata({ actionName: 'signUpAction' })
	.inputSchema(getSignUpSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput }) => {
		const newTenant = await tryCatch(authService.registerTenant(parsedInput))
		if (!newTenant.success) {
			if (newTenant.error instanceof StoreError) {
				throw newTenant.error
			}
			throw new StoreError(AuthErrorCode.UNKNOWN_ERROR)
		}

		// TODO: send verification mail to admin user later (REMEMBER THIS)

		const newSession = await tryCatch(
			authService.createSession(newTenant.data.user.id, SessionPlatform.Web),
		)
		if (!newSession.success) {
			throw new StoreError(AuthErrorCode.SESSION_CREATION_FAILED)
		}

		const setCookie = await tryCatch(
			authService.setSessionCookie(newSession.data.token),
		)
		if (!setCookie.success) {
			throw new StoreError(AuthErrorCode.COOKIE_SET_FAILED)
		}

		// TODO: send verification mail to admin user later --Remember this--
		return { success: true }
	})

async function getSignInSchema() {
	return await getServerSchema(signInValidation, 'validation')
}

export const signInAction = publicAction
	.metadata({ actionName: 'signInAction' })
	.inputSchema(getSignInSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput }) => {
		const authorized = await tryCatch(
			authService.authorizeCredentials(parsedInput),
		)
		if (!authorized.success) {
			if (authorized.error instanceof StoreError) {
				throw authorized.error
			}
			throw new StoreError(AuthErrorCode.INVALID_CREDENTIALS)
		}

		const newSession = await tryCatch(
			authService.createSession(authorized.data.id, SessionPlatform.Web),
		)
		if (!newSession.success) {
			throw new StoreError(AuthErrorCode.SESSION_CREATION_FAILED)
		}

		const setCookie = await tryCatch(
			authService.setSessionCookie(newSession.data.token),
		)
		if (!setCookie.success) {
			throw new StoreError(AuthErrorCode.COOKIE_SET_FAILED)
		}

		return { success: true }
	})
