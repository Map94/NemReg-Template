import { Icons } from '@/components/common/icons'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import {
	TableViewContainer,
	ViewProvider,
} from '@/components/table-overview/table-view-container'

import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { tableService } from '@/service/table/service'

import { getTranslations } from 'next-intl/server'

async function Home({ user, tenant }: WithAuthProps) {
	const homeT = await getTranslations('HomePage')

	// Fetch user's tables
	const tables = await tableService.listTables(tenant.id)
	console.log('tables', tables, tenant)

	return (
		<ViewProvider>
			<Page.Header className='bg-background z-10'>
				<Page.Title>{homeT('title')}</Page.Title>
				<Page.Actions>
					<Link
						className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}
						href={'/tables'}>
						<Icons.plus />
					</Link>
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
