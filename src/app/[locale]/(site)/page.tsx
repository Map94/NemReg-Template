import { Icons } from '@/components/common/icons'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import {
	TableViewContainer,
	ViewProvider,
} from '@/components/table-overview/table-view-container'

import { Button } from '@/components/ui/button'
import { tableService } from '@/service/table/service'

import { getTranslations } from 'next-intl/server'

async function Home({ user, tenant }: WithAuthProps) {
	const homeT = await getTranslations('HomePage')

	// Fetch user's tables
	const { data: tables } = await tableService.getTables(user.id, tenant.id, {
		favoriteOnly: false,
		limit: 100,
		page: 1,
	})
	console.log('tables', tables, tenant)

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
