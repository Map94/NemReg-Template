import { client, db, Tx } from '@/lib/db/connection'
import { masterTable } from '@/lib/db/schema/table'
import { ApplicationError } from '@/lib/safe-action'
import { generateRandomString } from '@/lib/utils'
import { and, desc, eq } from 'drizzle-orm'
import { Tenant } from '../auth/models'
import { Column, NewTable, Table } from './models'

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

	deleteTable: async function (tableId: string): Promise<boolean> {
		const table = await db
			.select({ databaseName: masterTable.databaseName })
			.from(masterTable)
			.where(eq(masterTable.id, tableId))
			.limit(1)

		const result = await client.batch([
			{
				sql: 'DELETE FROM _master_table WHERE id = ?',
				args: [tableId],
			},
			{
				sql: `DROP TABLE IF EXISTS "${table[0].databaseName}"`,
				args: [],
			},
		])

		return result[0].rowsAffected === 1
	},

	getTableById: async function (
		tableId: string,
		tenantId: string,
		tx: Tx = db,
	): Promise<Table | undefined> {
		const tables = await tx
			.select()
			.from(masterTable)
			.where(
				and(eq(masterTable.id, tableId), eq(masterTable.tenantId, tenantId)),
			)
			.limit(1)
		return tables.at(0)
	},

	updateTableRow: async function (
		tableId: string,
		recordId: string,
		data: Record<string, any>,
		tenantId: string,
	): Promise<boolean> {
		const table = await this.getTableById(tableId, tenantId)

		if (!table) {
			throw new ApplicationError('Table not found', 'Store: Not Found')
		}

		const { sql, args } = generateUpdateTableSQL(
			table.databaseName,
			data,
			recordId,
		)

		const result = await client.execute({
			sql: sql,
			args: args,
		})

		return result.rowsAffected === 1
	},

	insertTableRow: async function (
		databaseName: string,
		data: Record<string, any>,
		tenantId: string,
	): Promise<boolean> {
		const { sql, args } = generateInsertTableSQL(databaseName, data)

		const result = await client.execute({
			sql: sql,
			args: args,
		})

		return result.rowsAffected === 1
	},

	getTableData: async function (
		databaseName: string,
		tenantId: string,
		options?: {
			limit?: number
			offset?: number
			// Future spot for search, filters and sorting
		},
	): Promise<Record<string, any>[]> {
		const { sql, args } = generateSelectTableSql(
			databaseName,
			options?.limit,
			options?.offset,
		)

		const result = await client.execute({ sql, args })

		return result.rows as Record<string, any>[]
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

function generateUpdateTableSQL(
	databaseName: string,
	data: Record<string, any>,
	recordId: string,
): { sql: string; args: any[] } {
	const tableName = `"${databaseName}"`
	const columns = Object.keys(data)
	const values = Object.values(data)

	const setClauses = columns.map(col => `"${col}" = ?`).join(', ')

	const sql = `UPDATE ${tableName} SET ${setClauses} WHERE id = ?`
	const args = [...values, recordId]

	return { sql, args }
}

function generateInsertTableSQL(
	databaseName: string,
	data: Record<string, any>,
): { sql: string; args: any[] } {
	const tableName = `"${databaseName}"`
	const columns = Object.keys(data)
	const values = Object.values(data)

	const columnList = columns.map(col => `"${col}"`).join(', ')

	const placeholders = columns.map(() => '?').join(', ')

	const sql = `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholders})`
	const args = values
	return { sql, args }
}

function generateSelectTableSql(
	databaseName: string,
	limit?: number,
	offset?: number,
): { sql: string; args: any[] } {
	const tableName = `"${databaseName}"`

	let sql = `SELECT * FROM ${tableName}`
	const args: any[] = []

	sql += ' ORDER BY rowid'

	if (limit) {
		sql += ' LIMIT ?'
		args.push(limit)
	}

	if (offset && limit) {
		sql += ' OFFSET ?'
		args.push(offset)
	}

	return { sql, args }
}
