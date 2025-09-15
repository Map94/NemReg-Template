import { columnValidation } from '@/store/tables/models'
import z from 'zod'

export const createTableValidation = z.object({
	displayName: z.string(),
	columns: z.array(columnValidation.omit({ id: true, databaseName: true })),
})

export const deleteTableValidation = z.object({
	tableId: z.string(),
})

export const getTableByIdValidation = z.object({
	tableId: z.string(),
})

export const updateTableRowValidation = z.object({
	tableId: z.string(),
	recordId: z.string(),
	data: z.record(z.string(), z.any()),
})
// Andreas
export const insertTableRowValidation = z.object({
	tableId: z.string(),
	data: z.record(z.string(), z.any()),
})
// Andreas
export const getTableDataValidation = z.object({
	tableId: z.string(),
	limit: z.number().optional(),
	offset: z.number().optional(),
})

export type CreateTableInput = z.infer<typeof createTableValidation>
