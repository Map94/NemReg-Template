import { Column } from '@/store/tables/models'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { tenantsTable, usersTable } from './auth'

export const masterTable = sqliteTable('_master_table', {
	id: text('id').primaryKey(),
	databaseName: text('database_name').notNull(),
	displayName: text('display_name').notNull(),
	displayDescription: text('display_description'),
	columns: text('columns', { mode: 'json' }).$type<Column[]>().notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
	userId: text('user_id').references(() => usersTable.id, {
		onDelete: 'set null',
	}),
	tenantId: text('tenant_id')
		.notNull()
		.references(() => tenantsTable.id, { onDelete: 'cascade' }),
})

// export const tableActivity = sqliteTable('table_activity', {
// 	id: text('id').primaryKey(),
// 	tableId: text('table_id').references(() => clientTable.id),
// 	userId: text('user_id').notNull(),
// 	action: text('action').notNull(), // 'created', 'modified', 'deleted', 'data_added', 'data_updated', 'data_deleted'
// 	details: text('details', { mode: 'json' }).$type<ActivityDetails>(),
// 	timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
// })

// // This table stores individual records for user-created tables
// export const tableRecords = sqliteTable('table_records', {
// 	id: text('id').primaryKey(),
// 	tableId: text('table_id')
// 		.references(() => clientTable.id, { onDelete: 'cascade' })
// 		.notNull(),
// 	recordData: text('record_data', { mode: 'json' })
// 		.$type<Record<string, any>>()
// 		.notNull(),
// 	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
// 	updatedAt: text('updated_at'),
// 	userId: text('user_id').notNull(),
// })
