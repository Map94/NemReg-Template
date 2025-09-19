export interface SimplifiedDataColumn {
	id: string
	name: string
	columnName: string
	type: FieldType // Back to your original approach but with better types
	isPrimary: boolean
	isRequired: boolean
	isUnique: boolean
	isIndexed?: boolean
	customOptions?: string[] // For select fields - simple string array
}

export interface ActivityDetails {
	description?: string
	columnChanges?: {
		added?: string[]
		removed?: string[]
		modified?: string[]
	}
	recordCount?: number
	oldValues?: Record<string, any>
	newValues?: Record<string, any>
}

export enum FieldType {
	Text = 'TEXT',
	Numeric = 'NUMERIC',
}
