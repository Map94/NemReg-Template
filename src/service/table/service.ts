import { db } from '@/lib/db/connection'
import { generateRandomString } from '@/lib/utils'
import { CreateTableInput } from '@/schemas/tables'
import { Tenant, User } from '@/store/auth/models'
import { tableStore } from '@/store/tables/data'
import { NewTable, Table } from '@/store/tables/models'

export const tableService = {
	createTable: async function (
		tenantId: Tenant['id'],
		userId: User['id'],
		input: CreateTableInput, // make schema for form data
	): Promise<Table> {
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

		const { table } = await db.transaction(async tx => {
			const newMasterTable = await tableStore.createTable(newTable, tx)

			// implement store function to create new tenant table

			return { table: newMasterTable }
		})

		return table
	},
	listTables: async function (tenantId: Tenant['id']): Promise<Table[]> {
		return await tableStore.listTable(tenantId)
	},
}
