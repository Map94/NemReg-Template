import z from 'zod'

const columnSchema = z.object({
	id: z.string(),
	name: z.string(),
	columnName: z.string(),
	type: z.enum(['TEXT', 'TEXTAREA', 'INTEGER' /* ... */]),
	isPrimary: z.boolean().default(false),
	isRequired: z.boolean().default(false),
	isUnique: z.boolean().default(false),
	isIndexed: z.boolean().optional(),
	customOptions: z.array(z.string()).optional(),
})

// Create
export const createTableSchema = z.object({
	name: z.string().min(1, 'Table name is required'),
	description: z.string().optional(),
	columns: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			columnName: z.string(),
			type: z.enum([
				'TEXT',
				'TEXTAREA',
				'INTEGER',
				'REAL',
				'BOOLEAN',
				'DATE',
				'TIMESTAMP',
				'EMAIL',
				'URL',
				'SELECT',
				'PHONE',
				'CURRENCY',
			]),
			isPrimary: z.boolean().default(false),
			isRequired: z.boolean().default(false),
			isUnique: z.boolean().default(false),
			isIndexed: z.boolean().optional(),
			customOptions: z.array(z.string()).optional(),
		}),
	),
})

// Read
export const getTableSchema = z.object({
	page: z.number().default(1),
	limit: z.number().default(10),
	search: z.string().optional(),
	favoriteOnly: z.boolean().default(false),
})

// Update

export const updateTableSchema = z.object({
	tableId: z.string(),
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	columns: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				columnName: z.string(),
				type: z.enum([
					'TEXT',
					'TEXTAREA',
					'INTEGER',
					'REAL',
					'BOOLEAN',
					'DATE',
					'TIMESTAMP',
					'EMAIL',
					'URL',
					'SELECT',
					'PHONE',
					'CURRENCY',
				]),
				isPrimary: z.boolean().default(false),
				isRequired: z.boolean().default(false),
				isUnique: z.boolean().default(false),
				isIndexed: z.boolean().optional(),
				customOptions: z.array(z.string()).optional(),
			}),
		)
		.optional(),
})

export const deleteTableSchema = z.object({
	tableId: z.string(),
})

export type CreateTableInput = z.infer<typeof createTableSchema>
