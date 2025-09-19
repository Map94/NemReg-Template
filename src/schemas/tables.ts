import { columnValidation } from '@/store/tables/models'
import z from 'zod'

export const createTableValidation = z.object({
	displayName: z.string(),
	displayDescription: z.string().optional(),
	columns: z.array(columnValidation.omit({ id: true, databaseName: true })),
})
export type CreateTableInput = z.infer<typeof createTableValidation>

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
