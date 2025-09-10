'use client'

import { Icons } from '@/components/common/icons'
import { ChartAreaAxes } from '@/components/table-overview/chartArea'
import { FavoriteButton } from '@/components/table-overview/favorite-button'
import { GridListButton } from '@/components/table-overview/grid-list-button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { createContext, useContext, useState } from 'react'

interface Table {
	id: string
	name: string
	description: string
	rows: string
}

interface TableViewContainerProps {
	tables: Table[]
	user: any
	headerButton?: boolean
}

const ViewContext = createContext<{
	isGridView: boolean
	toggleView: () => void
} | null>(null)

const useViewContext = () => {
	const context = useContext(ViewContext)
	if (!context) {
		throw new Error('useViewContext must be used within ViewProvider')
	}
	return context
}

export function ViewProvider({ children }: { children: React.ReactNode }) {
	const [isGridView, setIsGridView] = useState(() => {
		if (typeof window !== 'undefined') {
			const savedView = localStorage.getItem('tableViewMode')
			return savedView !== 'list'
		}
		return true
	})

	const toggleView = () => {
		setIsGridView(prev => {
			const newView = !prev
			localStorage.setItem('tableViewMode', newView ? 'grid' : 'list')
			return newView
		})
	}

	return (
		<ViewContext.Provider value={{ isGridView, toggleView }}>
			{children}
		</ViewContext.Provider>
	)
}

export function TableViewHeaderButton() {
	const { isGridView, toggleView } = useViewContext()
	return <GridListButton isGridView={isGridView} onToggle={toggleView} />
}

export function TableViewContent({
	tables,
	user,
}: {
	tables: Table[]
	user: any
}) {
	const { isGridView } = useViewContext()

	return (
		<main
			className={`w-full  ${isGridView ? 'grid grid-cols-4 gap-4 items-center sm:items-start ' : 'flex flex-col gap-2'}`}>
			{tables.map(table => (
				<Link
					key={table.id}
					href={`/tables/${table.id}`}
					className='block w-full'>
					{isGridView ? (
						<Card className='hover:border-cyan-300/50'>
							<CardHeader>
								<CardTitle className='grid grid-cols-[16px_1fr] gap-2'>
									<Icons.table className='size-4' />
									<p className='line-clamp-1'>{table.name}</p>
								</CardTitle>

								<CardDescription className='line-clamp-1'>
									{table.description}
								</CardDescription>
								<CardAction>
									<FavoriteButton tableId={table.id} />
								</CardAction>
							</CardHeader>
							<CardContent className='flex w-full'>
								<ChartAreaAxes />
							</CardContent>
							<CardFooter className='text-xs flex justify-between items-center'>
								<p className='px-2 py-1 bg-cyan-500/15 text-cyan-600 rounded-sm font-semibold'>
									{user.updatedAt
										? 'Updated:'
										: user.createdAt
											? 'Created:'
											: 'Date:'}{' '}
									{user.updatedAt
										? new Date(user.updatedAt).toLocaleString()
										: user.createdAt
											? new Date(user.createdAt).toLocaleString()
											: 'N/A'}
								</p>
								<div className='flex items-center gap-1 px-2 py-1 bg-emerald-500/15 text-emerald-600 rounded-sm font-semibold'>
									<Icons.rows className='size-4.5 ' />
									<p>{table.rows}</p>
								</div>
							</CardFooter>
						</Card>
					) : (
						<div className='flex items-center gap-2 p-2 border rounded-lg hover:border-cyan-300/50 hover:bg-cyan-500/10'>
							<Icons.table className='size-4.5' />
							<div className='flex-1 flex items-center gap-1 min-w-0'>
								<span
									className='font-semibold min-w-[400px] max-w-[400px] flex-shrink-0 line-clamp-1 cursor-pointer'
									title={table.name}>
									{table.name}
								</span>
								<span className='text-sm text-gray-500 line-clamp-1 flex-1 min-w-0'>
									{table.description}
								</span>
							</div>
							<p className='px-2 py-1 bg-cyan-500/15 text-cyan-600 rounded-sm font-semibold text-xs'>
								{user.updatedAt
									? 'Updated:'
									: user.createdAt
										? 'Created:'
										: 'Date:'}{' '}
								{user.updatedAt
									? new Date(user.updatedAt).toLocaleString()
									: user.createdAt
										? new Date(user.createdAt).toLocaleString()
										: 'N/A'}
							</p>
							<div className='flex items-center gap-4 flex-shrink-0'>
								<div className='flex items-center gap-1 px-2 py-1 bg-emerald-500/15 text-emerald-600 rounded-sm font-semibold text-xs'>
									<Icons.rows className='size-4' />
									<span>{table.rows}</span>
								</div>
								<FavoriteButton tableId={table.id} />
							</div>
						</div>
					)}
				</Link>
			))}
		</main>
	)
}

// Legacy component for backward compatibility
export function TableViewContainer({
	tables,
	user,
	headerButton = false,
}: TableViewContainerProps) {
	if (headerButton) {
		return <TableViewHeaderButton />
	}
	return <TableViewContent tables={tables} user={user} />
}
