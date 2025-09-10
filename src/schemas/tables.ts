import { columnValidation } from '@/store/tables/models'
import z from 'zod'

export const createTableValidation = z.object({
	displayName: z.string(),
	columns: z.array(columnValidation.omit({ id: true, databaseName: true })),
})

export type CreateTableInput = z.infer<typeof createTableValidation>
