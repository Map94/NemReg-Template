import { authService } from '@/service/auth/service'
import { Role } from '@/store/auth/models'
import { StoreError } from '@/store/error'
import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'
import z from 'zod'

const baseActionClient = createSafeActionClient({
	defaultValidationErrorsShape: 'flattened',
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
		})
	},
	handleServerError(err, utils) {
		if (err instanceof StoreError) {
			return JSON.stringify({ code: err.code, message: err.message })
		}

		if (err instanceof ApplicationError) {
			return err.message
		}

		console.log('server error', err)
		return DEFAULT_SERVER_ERROR_MESSAGE
	},
})

export const publicAction = baseActionClient

export const authAction = publicAction.use(async ({ next }) => {
	const { session, tenant, user } = await authService.verify()

	if (!session) {
		throw new Error('Authentication required')
	}

	return next({ ctx: { session, tenant, user } })
})

export const adminAction = authAction.use(async ({ next, ctx }) => {
	if (ctx.user.role !== Role.Administrator) {
		throw new ApplicationError(
			'user is not an administrator',
			'Actions: Forbidden',
		)
	}

	return next({ ctx })
})

export class ApplicationError extends Error {
	public readonly code: Code
	public readonly context?: Record<string, any>

	constructor(message: string, code: Code, context?: Record<string, any>) {
		super(message)
		this.name = 'ApplicationError'
		this.code = code
		this.context = context

		if ('captureStackTrace' in Error) {
			Error.captureStackTrace(this, this.constructor)
		}
	}
}

const codes = [
	'Internal Server Error',
	'Not Found',
	'Bad Request',
	'Validation Error',
	'Unauthorized',
	'Forbidden',
	'Conflict',
	'Database Error',
] as const

const layers = ['Store', 'Service', 'Actions', 'Api'] as const

type Code = `${(typeof layers)[number]}: ${(typeof codes)[number]}`
