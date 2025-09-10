import { db } from '@/lib/db/connection'
import { clientTable, tableActivity } from '@/lib/db/schema/table'
import { FieldType, SimplifiedDataColumn } from '@/lib/type/table'
import { generateRandomString } from '@/lib/utils'
import { and, eq, sql } from 'drizzle-orm'

export const tableService = {
	createTable: async function (tableData: {
		name: string
		description?: string
		columns: SimplifiedDataColumn[]
		userId: string
		clientId: string
	}) {
		const tableName = `user_table_${generateRandomString(8)}`

		const columnsWithId = tableData.columns.some(col => col.isPrimary)
			? tableData.columns
			: [
					{
						id: generateRandomString(8),
						name: 'ID',
						columnName: 'id',
						type: 'TEXT' as FieldType,
						isPrimary: true,
						isRequired: true,
						isUnique: true,
					},
					...tableData.columns,
				]

		const [newTable] = await db
			.insert(clientTable)
			.values({
				id: generateRandomString(12),
				name: tableData.name,
				tableName,
				description: tableData.description,
				columns: columnsWithId,
				userId: tableData.userId,
				clientId: tableData.clientId,
			})
			.returning()

		await db.insert(tableActivity).values({
			id: generateRandomString(12),
			tableId: newTable.id,
			userId: tableData.userId,
			action: 'created',
			details: {
				description: `Created table "${tableData.name}" with ${columnsWithId.length} columns`,
			},
		})

		return newTable
	},

	getTables: async function (
		userId: string,
		clientId: string,
		options?: {
			page?: number
			limit?: number
			search?: string
			favoriteOnly?: boolean
		},
	) {
		const { page = 1, limit = 10, search, favoriteOnly } = options || {}
		let whereConditions = and(
			eq(clientTable.clientId, clientId),
			eq(clientTable.isArchived, false),
		)

		if (search) {
			whereConditions = and(
				whereConditions,
				sql`${clientTable.name} LIKE ${`%${search}%`}`,
			)
		}

		if (favoriteOnly) {
			whereConditions = and(whereConditions, eq(clientTable.isFavorite, true))
		}

		const tables = await db
			.select()
			.from(clientTable)
			.where(whereConditions)
			.limit(limit)
			.offset((page - 1) * limit)
			.orderBy(sql`${clientTable.inserted} DESC`)

		const totalResult = await db
			.select({ count: sql<number>`count(*)` })
			.from(clientTable)
			.where(whereConditions)

		const total = totalResult[0]?.count || 0
		const pages = Math.ceil(total / limit)

		return {
			data: tables,
			pagination: {
				page,
				limit,
				total,
				pages,
				hasNext: page < pages,
				hasPrev: page > 1,
			},
		}
	},

	getTableById: async function (
		tableId: string,
		userId: string,
		clientId: string,
	) {
		try {
			const table = await db
				.select()
				.from(clientTable)
				.where(
					and(
						eq(clientTable.id, tableId),
						eq(clientTable.userId, userId),
						eq(clientTable.clientId, clientId),
					),
				)
				.limit(1)

			if (!table.length) {
				return { success: false, error: 'Table not found' }
			}
			return { success: true, data: table[0] }
		} catch (error) {
			console.error('Error getting table:', error)
			return { success: false, error: 'Failed to get table' }
		}
	},

	updateTable: async function (
		tableId: string,
		updates: {
			name?: string
			description?: string
			columns?: SimplifiedDataColumn[]
		},
		userId: string,
		clientId: string,
	) {
		try {
			const tableCheck = await this.getTableById(tableId, userId, clientId)
			if (!tableCheck.success) {
				return tableCheck
			}
			const updated = await db
				.update(clientTable)
				.set({
					...updates,
					updatedAt: sql`CURRENT_TIMESTAMP`,
				})
				.where(eq(clientTable.id, tableId))
				.returning()

			await db.insert(tableActivity).values({
				id: generateRandomString(12),
				tableId,
				userId,
				action: 'modified',
				details: {
					description: 'Updated table definition',
				},
			})

			return { success: true, data: updated[0] }
		} catch (error) {
			console.error('Error updating table:', error)
			return { success: false, error: 'Failed to update table' }
		}
	},

	deleteTable: async function (
		tableId: string,
		userId: string,
		clientId: string,
	) {
		try {
			const tableCheck = await this.getTableById(tableId, userId, clientId)
			if (!tableCheck.success) {
				return tableCheck
			}

			await db
				.update(clientTable)
				.set({
					isArchived: true,
					updatedAt: sql`CURRENT_TIMESTAMP`,
				})
				.where(eq(clientTable.id, tableId))

			await db.insert(tableActivity).values({
				id: generateRandomString(12),
				tableId,
				userId,
				action: 'deleted',
				details: {
					description: `Archived table`,
				},
			})

			return { success: true, message: 'Table archived successfully' }
		} catch (error) {
			console.error('Error deleting table', error)
			return { success: false, error: 'Failed to delete table' }
		}
	},
}
