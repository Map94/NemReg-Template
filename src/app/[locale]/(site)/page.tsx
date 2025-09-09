import { Icons } from '@/components/common/icons'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ChartAreaAxes } from '@/components/ui/chartArea'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

async function Home({ user, tenant }: WithAuthProps) {
	const t = await getTranslations('home')

	// Mock table data - replace with your actual table data
	const tables = [
		{
			id: '1',
			name: 'Table name',
			description: 'Card Description',
			rows: '4',
		},
		{
			id: '2',
			name: 'Another table',
			description:
				'Another description Another description Another description Another description Another description Another description Another description Another description',
			rows: '10',
		},
		{
			id: '3',
			name: '3rd table',
			description: '3rd description',
			rows: '123',
		},
		{
			id: '4',
			name: '4th table',
			description: '4th description',
			rows: '0',
		},
	]

	return (
		<>
			<Page.Header>
				<Page.Title>{t('title')}</Page.Title>
				<Page.Actions>
					<Button size='icon' variant='ghost'>
						<Icons.plus />
					</Button>
				</Page.Actions>
			</Page.Header>
			<Page.Content>
				<div className='font-sans flex items-center justify-items-start pt-5 pb-20 gap-16'>
					<main className='grid grid-cols-4 gap-4 items-center sm:items-start w-full'>
						{tables.map(table => (
							<Link
								key={table.id}
								href={`/tables/${table.id}`}
								className='block w-full'>
								<Card>
									<CardHeader>
										<CardTitle>
											<span className='flex items-center gap-2'>
												<Icons.table className='size-4' />
												{table.name}
											</span>
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
							</Link>
						))}
					</main>
				</div>
			</Page.Content>
		</>
	)
}

export default withAuth(Home)
