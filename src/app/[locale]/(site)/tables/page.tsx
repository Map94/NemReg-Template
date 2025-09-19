import { Page } from '@/components/common/page'
import { CreateForm } from '@/components/table-creation/create-form'

export default function TablesPage() {
	return (
		<>
			<Page.Header className='mb-4 z-10 bg-background'>
				<Page.Title>Create Table</Page.Title>
				<div className='text-muted-foreground text-sm'>
					Follow the steps below to create your new table
				</div>
			</Page.Header>
			<Page.Content className='flex flex-1 items-center'>
				<CreateForm />
			</Page.Content>
		</>
	)
}
