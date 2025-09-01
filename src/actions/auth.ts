'use server'

import { AuthErrorCode, StructuredError } from '@/lib/errors'
import { publicAction } from '@/lib/safe-action'
import { tryCatch } from '@/lib/try-catch'
import { signInValidation, signUpValidation } from '@/schemas/auth'
import { getServerSchema } from '@/schemas/utils'
import { authService } from '@/service/auth/service'
import { SessionPlatform } from '@/store/auth/models'
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
			if (newTenant.error instanceof StructuredError) {
				throw newTenant.error
			}
			throw new StructuredError(
				AuthErrorCode.UNKNOWN_ERROR,
				newTenant.error.message,
			)
		}

		// TODO: send verification mail to admin user later (REMEMBER THIS)

		const newSession = await tryCatch(
			authService.createSession(newTenant.data.user.id, SessionPlatform.Web),
		)
		if (!newSession.success) {
			throw new StructuredError(
				AuthErrorCode.SESSION_CREATION_FAILED,
				newSession.error.message,
			)
		}

		const setCookie = await tryCatch(
			authService.setSessionCookie(newSession.data.token),
		)
		if (!setCookie.success) {
			throw new StructuredError(
				AuthErrorCode.COOKIE_SET_FAILED,
				setCookie.error.message,
			)
		}
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
			if (authorized.error instanceof StructuredError) {
				throw authorized.error
			}
			throw new StructuredError(
				AuthErrorCode.INVALID_CREDENTIALS,
				authorized.error.message,
			)
		}

		const newSession = await tryCatch(
			authService.createSession(authorized.data.id, SessionPlatform.Web),
		)
		if (!newSession.success) {
			throw new StructuredError(
				AuthErrorCode.SESSION_CREATION_FAILED,
				newSession.error.message,
			)
		}

		const setCookie = await tryCatch(
			authService.setSessionCookie(newSession.data.token),
		)
		if (!setCookie.success) {
			throw new StructuredError(
				AuthErrorCode.COOKIE_SET_FAILED,
				setCookie.error.message,
			)
		}
	})
