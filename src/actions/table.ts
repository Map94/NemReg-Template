'use server'

import { authAction } from '@/lib/safe-action'
import { createTableValidation } from '@/schemas/tables'
import { tableService } from '@/service/table/service'

export const createTableAction = authAction
	.metadata({ actionName: 'createTableAction' })
	.inputSchema(createTableValidation)
	.action(async ({ parsedInput, ctx }) => {
		const table = await tableService.createTable(
			ctx.tenant.id,
			ctx.user.id,
			parsedInput,
		)
	})
