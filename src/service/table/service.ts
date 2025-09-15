import { client } from '@/lib/db/connection'
import { generateRandomString } from '@/lib/utils'
import { CreateTableInput } from '@/schemas/tables'
import { Tenant, User } from '@/store/auth/models'
import { tableStore } from '@/store/tables/data'
import { NewTable, Table } from '@/store/tables/models'

export const tableService = {
	createTable: async function (
		tenantId: Tenant['id'],
		userId: User['id'],
		input: CreateTableInput,
	): Promise<boolean> {
		const newTable: NewTable = {
			id: generateRandomString(32, 'table_'),
			columns: input.columns.map(c => ({
				type: c.type,
				displayName: c.displayName,
				id: generateRandomString(8),
				databaseName: generateRandomString(8, 'field_'),
			})),
			displayName: input.displayName,
			tenantId: tenantId,
			userId: userId,
			databaseName: generateRandomString(8),
		}

		await client.transaction('write')

		const didCreateTable = await tableStore.createTable(newTable)

		return didCreateTable
	},
	listTables: async function (tenantId: Tenant['id']): Promise<Table[]> {
		return await tableStore.listTable(tenantId)
	},

	deleteTable: async function (
		tenantId: Tenant['id'],
		input: { tableId: string },
	): Promise<boolean> {
		return await tableStore.deleteTable(input.tableId)
	},

	getTableById: async function (
		tenantId: Tenant['id'],
		tableId: string,
	): Promise<Table | undefined> {
		return await tableStore.getTableById(tableId, tenantId)
	},

	updateTableRow: async function (
		tenantId: Tenant['id'],
		input: { tableId: string; recordId: string; data: Record<string, any> },
	): Promise<boolean> {
		const result = await tableStore.updateTableRow(
			input.tableId,
			input.recordId,
			input.data,
			tenantId,
		)
		return result
	},
	// Andreas
	insertTableRow: async function (
		tenantId: Tenant['id'],
		input: { tableId: string; data: Record<string, any> },
	): Promise<boolean> {
		const result = await tableStore.insertTableRow(
			input.tableId,
			input.data,
			tenantId,
		)
		return result
	},
	// Andreas
	getTableData: async function (
		tenantId: Tenant['id'],
		input: {
			tableId: string
			limit?: number
			offset?: number
		},
	): Promise<Record<string, any>[]> {
		const data = await tableStore.getTableData(input.tableId, tenantId, {
			limit: input.limit,
			offset: input.offset,
		})
		return data
	},
}
