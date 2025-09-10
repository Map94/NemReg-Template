'use server'

import { authAction } from '@/lib/safe-action'
import {
	createTableSchema,
	deleteTableSchema,
	getTableSchema,
	updateTableSchema,
} from '@/schemas/tables'
import { tableService } from '@/service/table/service'

export const createTableAction = authAction
	.metadata({ actionName: 'createTableAction' })
	.inputSchema(createTableSchema)
	.action(async ({ parsedInput, ctx }) => {
		const table = await tableService.createTable({
			name: parsedInput.name,
			description: parsedInput.description,
			columns: parsedInput.columns,
			userId: ctx.user.id,
			clientId: ctx.tenant.id,
		})
		return table
	})

export const getTableAction = authAction
	.metadata({ actionName: 'getTableAction' })
	.inputSchema(getTableSchema)
	.action(async ({ parsedInput, ctx }) => {
		const tables = await tableService.getTables(
			ctx.user.id,
			ctx.tenant.id,
			parsedInput,
		)
		return tables
	})

export const updateTableAction = authAction
	.metadata({ actionName: 'updateTableAction' })
	.inputSchema(updateTableSchema)
	.action(async ({ parsedInput, ctx }) => {
		const updatedTable = await tableService.updateTable(
			parsedInput.tableId,
			{
				name: parsedInput.name,
				description: parsedInput.description,
				columns: parsedInput.columns,
			},
			ctx.user.id,
			ctx.tenant.id,
		)
		return updatedTable
	})

export const deleteTableAction = authAction
	.metadata({ actionName: 'deleteTableAction' })
	.inputSchema(deleteTableSchema)
	.action(async ({ parsedInput, ctx }) => {
		const result = await tableService.deleteTable(
			parsedInput.tableId,
			ctx.user.id,
			ctx.tenant.id,
		)
		return result
	})
