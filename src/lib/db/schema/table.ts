import { ActivityDetails, SimplifiedDataColumn } from '@/lib/type/table'
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const clientTable = sqliteTable('_master_table', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	tableName: text('table_name').notNull().unique(),
	description: text('description'),
	columns: text('columns', { mode: 'json' })
		.$type<SimplifiedDataColumn[]>()
		.notNull(),
	inserted: text('inserted').default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at'),
	userId: text('user_id').notNull(),
	clientId: text('client_id').notNull(),
	isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
	isArchived: integer('is_archived', { mode: 'boolean' }).default(false),
	recordCount: integer('record_count').default(0),
})

export const tableActivity = sqliteTable('table_activity', {
	id: text('id').primaryKey(),
	tableId: text('table_id').references(() => clientTable.id),
	userId: text('user_id').notNull(),
	action: text('action').notNull(), // 'created', 'modified', 'deleted', 'data_added', 'data_updated', 'data_deleted'
	details: text('details', { mode: 'json' }).$type<ActivityDetails>(),
	timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
})

// This table stores individual records for user-created tables
export const tableRecords = sqliteTable('table_records', {
	id: text('id').primaryKey(),
	tableId: text('table_id')
		.references(() => clientTable.id, { onDelete: 'cascade' })
		.notNull(),
	recordData: text('record_data', { mode: 'json' })
		.$type<Record<string, any>>()
		.notNull(),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at'),
	userId: text('user_id').notNull(),
})
