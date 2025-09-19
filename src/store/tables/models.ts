import { masterTable } from '@/lib/db/schema/table'
import { FieldType } from '@/lib/type/table'
import z from 'zod'

export type Table = typeof masterTable.$inferSelect
export type NewTable = typeof masterTable.$inferInsert

export enum ColumnType {
	Text = 'TEXT',
	Integer = 'INTEGER',
}

export const columnValidation = z.object({
	id: z.string(),
	databaseName: z.string(),
	displayName: z.string(),
	type: z.enum(FieldType),
	width: z.transform(Number).pipe(z.number()),
})

export type Column = z.infer<typeof columnValidation>
