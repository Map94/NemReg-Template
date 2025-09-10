import { db, Tx } from '@/lib/db/connection'
import { masterTable } from '@/lib/db/schema/table'
import { desc, eq } from 'drizzle-orm'
import { Tenant } from '../auth/models'
import { NewTable, Table } from './models'

export const tableStore = {
	createTable: async function (input: NewTable, tx: Tx = db): Promise<Table> {
		const [table] = await tx.insert(masterTable).values(input).returning()
		return table
	},
	listTable: async function (tenantId: Tenant['id'], tx: Tx = db) {
		return await tx
			.select()
			.from(masterTable)
			.where(eq(masterTable.tenantId, tenantId))
			.orderBy(desc(masterTable.createdAt))
	},
}
