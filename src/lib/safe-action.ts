import { StoreError } from '@/store/error'
import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'
import z from 'zod'

export class ApplicationError extends Error {}

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

		return DEFAULT_SERVER_ERROR_MESSAGE
	},
})

export const publicAction = baseActionClient
