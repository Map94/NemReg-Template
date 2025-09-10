import { masterTable } from '@/lib/db/schema/table'

export type Table = typeof masterTable.$inferSelect
export type NewTable = typeof masterTable.$inferInsert

export type Column = {
	id: string
	databaseName: string
	displayName: string
	type: ColumnType
}

export type ColumnType = 'TEXT' | 'INTEGER'
