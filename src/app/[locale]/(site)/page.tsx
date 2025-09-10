import { getTableAction } from '@/actions/table'
import { Icons } from '@/components/common/icons'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import {
	TableViewContainer,
	ViewProvider,
} from '@/components/table-overview/table-view-container'

import { Button } from '@/components/ui/button'

import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

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
				'Another description Another description Another description Another description Another description Another description Another description Another description Another description Another description Another description',
			rows: '10',
		},
		{
			id: '3',
			name: '3rd table name is too long to fit oh well, can we make it longer',
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

	const homeT = await getTranslations('HomePage')
	const tablesT = await getTranslations('tables')

	// Fetch user's tables
	const tablesResult = await getTableAction({ page: 1, limit: 10 })
	const tables = tablesResult?.data?.success
		? (tablesResult.data.data ?? [])
		: []

	return (
		<ViewProvider>
			<Page.Header>
				<Page.Title>{homeT('title')}</Page.Title>
				<Page.Actions>
					<Button size='icon' variant='ghost'>
						<Icons.plus />
					</Button>
					<TableViewContainer tables={tables} user={user} headerButton />
				</Page.Actions>
			</Page.Header>
			<Page.Content>

				<div className='font-sans flex items-center justify-items-start pt-5 pb-20 gap-16'>
					<TableViewContainer tables={tables} user={user} />

				</div>
			</Page.Content>
		</ViewProvider>
	)
}

export default withAuth(Home)
