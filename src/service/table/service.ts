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

		const foo = await client.transaction('write')

		const didCreateTable = await tableStore.createTable(newTable)

		return didCreateTable
	},
	listTables: async function (tenantId: Tenant['id']): Promise<Table[]> {
		return await tableStore.listTable(tenantId)
	},
}
