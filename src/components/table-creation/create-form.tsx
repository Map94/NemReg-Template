'use client'
import { createTableAction } from '@/actions/table'
import { Icons } from '@/components/common/icons'
import { Button } from '@/components/ui/button'
import { defineStepper } from '@/components/ui/stepper'
import { useRouter } from '@/i18n/navigation'
import { FieldType } from '@/lib/type/table'
import { createTableValidation } from '@/schemas/tables'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Badge } from '../ui/badge'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '../ui/select'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Textarea } from '../ui/textarea'

const { Stepper, useStepper } = defineStepper(
	{
		id: 'step-1',
		title: 'Name and description',
		description: 'Step 1 description',
	},
	{
		id: 'step-2',
		title: 'column name and types',
		description: 'Step 2 description',
	},

	{ id: 'step-3', title: 'Confirmation', description: 'Step 3 description' },
)

interface FormData {
	displayName: string
	displayDescription?: string
	columns: Array<{
		displayName: string
		type: string
		validations?: Array<{
			validation: string
			value?: string | number
		}>
	}>
}

export function CreateForm() {
	const [formData, setFormData] = useState<FormData>({
		displayName: '',
		displayDescription: '',
		columns: [],
	})
	const router = useRouter()

	const form = useForm<z.infer<typeof createTableValidation>>({
		resolver: zodResolver(createTableValidation),
		defaultValues: {
			displayName: '',
			displayDescription: '',
			columns: [],
		},
	})

	const { execute, isExecuting } = useAction(createTableAction, {
		onSuccess() {
			toast('Table created successfully!')
			router.replace('/')
		},
		onError({ error }) {
			console.log(error)
			toast('Failed to create table:')
		},
	})

	const updateFormData = (updates: Partial<FormData>) => {
		setFormData(prev => ({ ...prev, ...updates }))
	}

	const handleSubmit = () => {
		execute(form.getValues())
	}

	const methods = useStepper()
	return (
		<>
			<Form {...form}>
				<form className='w-full' onSubmit={form.handleSubmit(execute)}>
					<Stepper.Provider className='space-y-4 '>
						{({ methods }) => (
							<>
								<Stepper.Navigation className='p-2'>
									{methods.all.map((step, index) => {
										const stepIcons = [
											<Icons.user className='w-4 h-4' />,
											<Icons.rows className='w-4 h-4' />,
											<Icons.check className='w-4 h-4' />,
										]

										return (
											<Stepper.Step
												key={step.id}
												of={step.id}
												onClick={() => methods.goTo(step.id)}
												icon={stepIcons[index]}>
												<Stepper.Title>{step.title}</Stepper.Title>
											</Stepper.Step>
										)
									})}
								</Stepper.Navigation>
								{methods.switch({
									'step-1': step => <Content1 id={step.id} form={form} />,
									'step-2': step => <Content2 id={step.id} form={form} />,

									'step-3': step => (
										<Content3
											id={step.id}
											form={form}
											onSubmit={handleSubmit}
											isExecuting={isExecuting}
										/>
									),
								})}
								<Stepper.Controls>
									<Button
										type='button'
										variant='secondary'
										onClick={methods.prev}
										disabled={methods.isFirst}>
										Back
									</Button>
									<Button
										type='button'
										onClick={methods.isLast ? handleSubmit : methods.next}
										disabled={isExecuting}>
										{methods.isLast
											? isExecuting
												? 'Creating...'
												: 'Create Table'
											: 'Next'}
									</Button>
								</Stepper.Controls>
							</>
						)}
					</Stepper.Provider>
				</form>
			</Form>
		</>
	)
}

const Content1 = ({
	id,

	form,
}: {
	id: string

	form: UseFormReturn<z.infer<typeof createTableValidation>>
}) => {
	return (
		<Stepper.Panel className='h-auto w-md content-center rounded-2xl border bg-card p-8'>
			<div className='flex flex-col gap-4'>
				<FormField
					control={form.control}
					name='displayName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Table name</FormLabel>
							<FormControl>
								<Input placeholder='Enter Table name' {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='displayDescription'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Enter description'
									className=''
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</Stepper.Panel>
	)
}

type ValidationType = {
	id: number
	validation: string
	value?: string | number
}
type ColumnType = { id: number; type: string }
type Column = {
	id: number
	name: string
	types: ColumnType[]
	validations: ValidationType[]
}

const validationTypes = [
	{ value: 'required', label: 'Required' },
	{ value: 'min_length', label: 'Min. Length' },
	{ value: 'max_length', label: 'Max. Length' },
	{ value: 'pattern', label: 'Pattern/Regex' },
	{ value: 'unique', label: 'Unique' },
	{ value: 'not_null', label: 'Not Null' },
]

const Content2 = ({
	id,
	form,
}: {
	id: string
	form: UseFormReturn<z.infer<typeof createTableValidation>>
}) => {
	const [columnName, setColumnName] = useState('')
	const [columnType, setColumnType] = useState<FieldType>(FieldType.Text)
	const [columnWidth, setColumnWidth] = useState<number>(1)

	//const tCreationPage = useTranslations('CreationPage')
	const { fields, append, remove, move } = useFieldArray({
		name: 'columns',
		control: form.control,
	})
	const tabs = [
		{
			name: 'Full',
			value: 'full',
			count: '100%',
			width: 1,
			content: <></>,
		},
		{
			name: 'Half',
			value: 'half',
			count: '50%',
			width: 0.5,
			content: <></>,
		},
	]
	const currentTabValue = columnWidth === 1 ? 'full' : 'half'

	return (
		<Stepper.Panel className='h-full w-full relative rounded-2xl border bg-card p-8'>
			<div className='flex gap-6 h-full'>
				<div className=' flex-shrink-0 w-80'>
					<div className='sticky top-20 flex flex-col gap-4 p-4 border rounded-lg bg-background h-fit'>
						<h3 className='text-lg font-semibold'>Define Column</h3>

						<div className='grid gap-1.5'>
							<Label>Column Name</Label>
							<Input
								value={columnName}
								onChange={e => setColumnName(e.target.value)}
							/>
						</div>

						<div className='grid gap-1.5'>
							<Label>Column Name</Label>
							<Select
								value={columnType}
								onValueChange={val => setColumnType(val as FieldType)}>
								<SelectTrigger className='w-full'>
									<SelectValue>{columnType}</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Types</SelectLabel>
										{Object.values(FieldType).map(ft => (
											<SelectItem key={ft} value={ft}>
												{ft}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className='w-full max-w-md'>
							<Tabs
								value={currentTabValue}
								onValueChange={value => {
									const selectedTab = tabs.find(tab => tab.value === value)
									if (selectedTab) {
										setColumnWidth(selectedTab.width)
									}
								}}
								className='gap-2'>
								<Label>Column width</Label>
								<div className='text-xs text-muted-foreground font-thin'>
									Choose the width of the columns for the app
								</div>
								<TabsList className='w-full'>
									{tabs.map(tab => (
										<TabsTrigger
											key={tab.value}
											value={tab.value}
											className='flex items-center gap-1 px-2.5 sm:px-3 data-[state=active]:border-primary dark:data-[state=active]:border-primary '>
											{tab.name}
											<Badge
												variant='blue'
												className='h-5 min-w-5 rounded-full px-1 tabular-nums'>
												{tab.count}
											</Badge>
										</TabsTrigger>
									))}
								</TabsList>

								{tabs.map(tab => (
									<TabsContent key={tab.value} value={tab.value}>
										<p className='text-muted-foreground text-sm'>
											{tab.content}
										</p>
									</TabsContent>
								))}
							</Tabs>
						</div>

						<div className='flex flex-col gap-2'>
							<div className='flex justify-between items-center'>
								<span className='font-medium'>Validations</span>
								<Button
									type='button'
									variant='outline'
									size='sm'
									//onClick={addValidation}
									className='flex items-center gap-1 text-xs'>
									<Icons.plus className='w-3 h-3' />
									Add Validation
								</Button>
							</div>
						</div>

						<Button
							type='button'
							onClick={() => {
								append({
									displayName: columnName,
									type: columnType,
									width: columnWidth,
								})
								setColumnName('')
								setColumnType(FieldType.Text)
								setColumnWidth(1)
							}}
							className='mt-4'>
							Done
						</Button>
					</div>
				</div>

				<div className='flex-1 overflow-y-auto'>
					<h3 className='text-lg font-semibold mb-4'>
						Added Columns ({fields.length})
					</h3>
					<div className='space-y-4'>
						{fields.length === 0 ? (
							<div className='text-center text-gray-500 py-8'>
								No columns added yet. Define a column and click "Done" to add
								it.
							</div>
						) : (
							fields.map((column, index) => (
								<div
									key={index}
									className='flex flex-col gap-3 p-4 border rounded-lg bg-background'>
									<div className='flex justify-between items-center'>
										<span className='font-medium'>{column.displayName}</span>
										<div className='space-x-2'>
											<Button
												type='button'
												variant='secondary'
												size='sm'
												disabled={index == 0}
												onClick={() => move(index, index - 1)}>
												<Icons.up className='w-4 h-4' />
											</Button>
											<Button
												type='button'
												variant='secondary'
												size='sm'
												disabled={index == fields.length - 1}
												onClick={() => move(index, index + 1)}>
												<Icons.down className='w-4 h-4' />
											</Button>
											<Button
												type='button'
												variant='destructive'
												size='sm'
												onClick={() => remove(index)}>
												<Icons.trash className='w-4 h-4' />
											</Button>
										</div>
									</div>
									<Badge className='flex flex-wrap gap-2' variant='blue'>
										<span className=' text-sm'>
											{validationTypes.find(ct => ct.value === column.type)
												?.label ?? column.type}
										</span>
									</Badge>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</Stepper.Panel>
	)
}

const Content3 = ({
	id,
	form,
	onSubmit,
	isExecuting,
}: {
	id: string
	form: UseFormReturn<z.infer<typeof createTableValidation>>
	onSubmit: () => void
	isExecuting: boolean
}) => {
	const formValues = form.getValues()
	return (
		<Stepper.Panel className='h-auto content-center rounded-2xl border bg-card p-8'>
			<div className='flex flex-col gap-6'>
				<h3 className='text-xl font-semibold'>Review Your Table</h3>

				<div className='space-y-4'>
					<div>
						<h4 className='font-medium'>Table Information</h4>
						<p className='text-sm text-muted-foreground'>
							Name: {formValues.displayName}
						</p>
						<p className='text-sm text-muted-foreground'>
							Description: {formValues.displayDescription || 'No description'}
						</p>
					</div>

					<div>
						<h4 className='font-medium mb-2'>Table Preview</h4>
						<div className='text-xs text-muted-foreground font-normal'>
							Number of columns: ({formValues.columns.length})
						</div>
						<Table className='border-1'>
							<TableCaption>
								Preview of "{formValues.displayName}" table structure
							</TableCaption>
							<TableHeader>
								<TableRow>
									{formValues.columns.map((column, index) => (
										<TableHead
											key={index}
											className={index === 0 ? 'w-[100px]' : ''}>
											{column.displayName}
											<div className='text-xs text-muted-foreground font-normal'>
												({column.type})
											</div>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									{formValues.columns.map((column, index) => (
										<TableCell
											key={index}
											className={index === 0 ? 'font-medium' : ''}>
											{column.type === FieldType.Text
												? 'Some text'
												: column.type === FieldType.Numeric
													? '1234'
													: 'Sample data'}
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									{formValues.columns.map((column, index) => (
										<TableCell
											key={index}
											className={index === 0 ? 'font-medium' : ''}>
											{column.type === FieldType.Text
												? 'Something else'
												: column.type === FieldType.Numeric
													? '5678'
													: 'Another sample'}
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									{formValues.columns.map((column, index) => (
										<TableCell
											key={index}
											className={index === 0 ? 'font-medium' : ''}>
											{column.type === FieldType.Text
												? 'Random text'
												: column.type === FieldType.Numeric
													? '91011'
													: 'Another sample'}
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									{formValues.columns.map((column, index) => (
										<TableCell
											key={index}
											className={index === 0 ? 'font-medium' : ''}>
											{column.type === FieldType.Text
												? 'This is an example'
												: column.type === FieldType.Numeric
													? '121314'
													: 'Another sample'}
										</TableCell>
									))}
								</TableRow>
							</TableBody>
						</Table>
					</div>

					<div>
						<h4 className='font-medium'>
							Columns ({formValues.columns.length})
						</h4>
						<div className='space-y-2'>
							{formValues.columns.map((column, index) => (
								<div key={index} className='flex items-center gap-2 text-sm'>
									<span className='font-medium'>{column.displayName}</span>
									<Badge className='px-2 py-1' variant='blue'>
										{column.type}
									</Badge>
									{/* {column.validations?.length > 0 && (
										<span className='text-xs text-muted-foreground'>
											+{column.validations.length} validation(s)
										</span>
									)} */}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</Stepper.Panel>
	)
}
