import { client, db, Tx } from '@/lib/db/connection'
import { masterTable } from '@/lib/db/schema/table'
import { generateRandomString } from '@/lib/utils'
import { desc, eq } from 'drizzle-orm'
import { Tenant } from '../auth/models'
import { Column, NewTable } from './models'

export const tableStore = {
	listTable: async function (tenantId: Tenant['id'], tx: Tx = db) {
		return await tx
			.select()
			.from(masterTable)
			.where(eq(masterTable.tenantId, tenantId))
			.orderBy(desc(masterTable.createdAt))
	},

	createTable: async function (input: NewTable): Promise<boolean> {
		const tenantTableSSQL = generateCreateTableSQL(
			input.databaseName,
			input.columns,
		)
		const result = await client.batch([
			{
				sql: 'insert into _master_table ("id", "database_name", "display_name", "display_description", "columns", "user_id", "tenant_id", "created_at", "updated_at") values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
				args: [
					generateRandomString(32, 'table_'),
					input.databaseName,
					input.displayName,
					input.displayDescription ?? '',
					JSON.stringify(input.columns),
					input.userId || null,
					input.tenantId,
					Number(new Date()),
					Number(new Date()),
				],
			},
			{
				sql: tenantTableSSQL,
				args: [],
			},
		])

		return result[0].rowsAffected == 1
	},
}

function generateCreateTableSQL(
	databaseName: string,
	columns: Column[],
): string {
	const tname = `"${databaseName}"`
	let statements = ['create table', tname, '(']
	let columnsStmt: string[] = []

	columns.forEach((c, i) => {
		columnsStmt.push(`"${c.databaseName}" ${c.type}`)
	})

	statements.push(columnsStmt.join(', '))
	statements.push(')')

	return statements.join(' ')
}
