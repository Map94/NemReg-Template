'use client'

import { Icons } from '@/components/common/icons'
import { Loader } from '@/components/common/loader'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableDynamicToolbar } from '@/components/data-table/data-table-dynamic-toolbar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDataTable } from '@/hooks/use-data-table'
import { createColumns } from '@/lib/date-table/columns'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { emitCustomEvent } from 'react-custom-events'

interface Props {
	tableId: string
	tableConfig: any
	promise: Promise<{
		data: Record<string, any>[]
		pageCount: number
	}>
}

export function Table({ promise, tableConfig, tableId }: Props) {
	const { data, pageCount } = React.use(promise)
	const t = useTranslations('tablesPage')

	const columnMapping: Record<string, string> = {}
	if (tableConfig.columns) {
		tableConfig.columns.forEach((col: any) => {
			columnMapping[col.databaseName] = col.displayName
		})
	}

	const getDisplayName = (databaseName: string) => {
		return columnMapping[databaseName] || databaseName
	}

	const allTableColumns = data && data.length > 0 ? Object.keys(data[0]) : []

	const columns = createColumns<Record<string, any>>(c => [
		c.display({
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value: any) =>
						table.toggleAllPageRowsSelected(!!value)
					}
					aria-label='Select all rows'
					className='translate-y-0.5'
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value: any) => row.toggleSelected(!!value)}
					aria-label='Select row'
					className='translate-y-0.5'
				/>
			),
			enableSorting: false,
			enableHiding: false,
		}),

		...allTableColumns.map(columnKey =>
			c.accessor(columnKey, {
				id: columnKey,
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={getDisplayName(columnKey)}
					/>
				),
				cell: ({ getValue }) => {
					const value = getValue()
					return <span>{String(value || '')}</span>
				},
				meta: {
					label: getDisplayName(columnKey),
					placeholder: `Filter by ${getDisplayName(columnKey)}`,
					variant: 'text',
					icon: Icons.type,
				},
				enableColumnFilter: true,
			}),
		),

		c.display({
			id: 'actions',
			cell: function Cell({ row }) {
				const [pending, startUpdateTransition] = React.useTransition()

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								aria-label='Open menu'
								variant='ghost'
								disabled={pending}
								className='flex size-8 p-0 data-[state=open]:bg-muted ml-auto'>
								{pending ? (
									<Loader />
								) : (
									<Icons.ellipsis className='size-4' aria-hidden='true' />
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-40'>
							<DropdownMenuItem>Edit Row</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={() => emitCustomEvent('delete-row-dialog', [row])}
								className='text-destructive'>
								Delete Row
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
			size: 40,
		}),
	])

	const { table } = useDataTable({
		data: data,
		columns,
		pageCount,
		getRowId: (original, index) => `row-${index}`,
		clearOnDefault: true,
		shallow: false,
		enableGlobalFilter: true,
		initialState: {
			sorting: [],
		},
	})

	return (
		<DataTable
			table={table}
			// actionBar={<TableDataActionBar table={table} />}
		>
			<DataTableDynamicToolbar table={table} showViewOptions showExportTable />
		</DataTable>
	)
}
