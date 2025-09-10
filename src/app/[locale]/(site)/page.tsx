import { getTableAction } from '@/actions/table'
import { Icons } from '@/components/common/icons'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

async function Home({ user, tenant }: WithAuthProps) {
	const homeT = await getTranslations('HomePage')
	const tablesT = await getTranslations('tables')

	// Fetch user's tables
	const tablesResult = await getTableAction({ page: 1, limit: 10 })
	const tables = tablesResult?.data?.success
		? (tablesResult.data.data ?? [])
		: []

	return (
		<>
			<Page.Header>
				<Page.Title>{homeT('title')}</Page.Title>
				<Page.Actions>
					<Button size='icon' variant='ghost'>
						<Icons.plus />
					</Button>
				</Page.Actions>
			</Page.Header>
			<Page.Content>
				<div className='container mx-auto p-6'>
					<div className='mb-8'>
						<h2 className='text-2xl font-bold mb-2'>{tablesT('title')}</h2>
						<p className='text-muted-foreground'>{tablesT('description')}</p>
					</div>

					{tables.length === 0 ? (
						<div className='flex flex-col items-center justify-center py-12'>
							<Icons.table className='h-16 w-16 text-muted-foreground mb-4' />
							<h3 className='text-lg font-medium mb-2'>
								{tablesT('noTablesTitle')}
							</h3>
							<p className='text-muted-foreground mb-4 text-center'>
								{tablesT('noTablesDescription')}
							</p>
							<Button>
								<Icons.plus className='mr-2 h-4 w-4' />
								{tablesT('createTable')}
							</Button>
						</div>
					) : (
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
							{tables.map((table: any) => (
								<Card
									key={table.id}
									className='hover:shadow-md transition-shadow'>
									<CardHeader>
										<div className='flex items-center justify-between'>
											<CardTitle className='text-lg'>{table.name}</CardTitle>
											<div className='flex items-center gap-2'>
												{table.isFavorite && (
													<Icons.heart className='h-4 w-4 fill-current text-red-500' />
												)}
												{table.isArchived && (
													<Icons.archive className='h-4 w-4 text-muted-foreground' />
												)}
											</div>
										</div>
										{table.description && (
											<CardDescription>{table.description}</CardDescription>
										)}
									</CardHeader>
									<CardContent>
										<div className='flex items-center justify-between text-sm text-muted-foreground'>
											<span>
												{table.columns?.length || 0} {tablesT('columns')}
											</span>
											<span>
												{table.recordCount || 0} {tablesT('records')}
											</span>
										</div>
										<div className='mt-4 flex gap-2'>
											<Button
												asChild
												variant='outline'
												size='sm'
												className='flex-1'>
												<Link href={`/tables/${table.id}`}>
													<Icons.eye className='mr-2 h-4 w-4' />
													{tablesT('view')}
												</Link>
											</Button>
											<Button
												asChild
												variant='outline'
												size='sm'
												className='flex-1'>
												<Link href={`/tables/${table.id}/edit`}>
													<Icons.edit className='mr-2 h-4 w-4' />
													{tablesT('edit')}
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</Page.Content>
		</>
	)
}

export default withAuth(Home)
