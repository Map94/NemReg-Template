'use server'

import { adminAction, authAction } from '@/lib/safe-action'
import {
	createTableValidation,
	deleteTableValidation,
	getTableByIdValidation,
	updateTableRowValidation,
} from '@/schemas/tables'
import { tableService } from '@/service/table/service'
import { flattenValidationErrors } from 'next-safe-action'

export const createTableAction = authAction
	.metadata({ actionName: 'createTableAction' })
	.inputSchema(createTableValidation)
	.action(async ({ parsedInput, ctx }) => {
		console.log('action hit', parsedInput)
		const table = await tableService.createTable(
			ctx.tenant.id,
			ctx.user.id,
			parsedInput,
		)
	})

export const deleteTableAction = adminAction
	.metadata({ actionName: 'deleteTableAction' })
	.inputSchema(deleteTableValidation, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		await tableService.deleteTable(ctx.tenant.id, parsedInput)
	})

export const getTableByIdAction = authAction
	.metadata({ actionName: 'getTableByIdAction' })
	.inputSchema(getTableByIdValidation)
	.action(async ({ parsedInput, ctx }) => {
		const table = await tableService.getTableById(
			ctx.tenant.id,
			parsedInput.tableId,
		)

		return table
	})

export const updateTableRowAction = authAction
	.metadata({ actionName: 'updateTableRowAction' })
	.inputSchema(updateTableRowValidation)
	.action(async ({ parsedInput, ctx }) => {
		const result = await tableService.updateTableRow(ctx.tenant.id, parsedInput)
		return result
	})
