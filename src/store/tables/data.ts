import { client, db, Tx } from '@/lib/db/connection'
import { masterTable } from '@/lib/db/schema/table'
import { desc, eq } from 'drizzle-orm'
import { Tenant } from '../auth/models'
import { Column, NewTable, Table } from './models'

export const tableStore = {
	createMetaTable: async function (
		input: NewTable,
		tx: Tx = db,
	): Promise<Table> {
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

	createTable: async function (input: Table, tx: Tx = db): Promise<boolean> {
		const sql = generateCreateTableSQL(input.databaseName, input.columns)
		const result = await client.execute(sql)
		return result.rowsAffected == 1
	},
}

function generateCreateTableSQL(
	databaseName: string,
	columns: Column[],
): string {
	let statements = ['create table', databaseName, '(']

	for (let column of columns) {
		statements.push(`${column.databaseName} ${column.type}`)
	}

	statements.push(')')
	statements.push(',')

	return statements.join(' ')
}
