'use client'

import { signUpAction } from '@/actions/auth'
import { Icons } from '@/components/common/icons'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link, useRouter } from '@/i18n/navigation'
import { AuthErrorCode, AuthErrorMessages } from '@/lib/errors'
import { signUpValidation } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

export function SignUpForm() {
	const router = useRouter()
	const t = useTranslations('validation')
	const signUpSchema = signUpValidation(t)
	const { execute, isExecuting } = useAction(signUpAction, {
		onError(args) {
			if (args.error.serverError) {
				// Try to parse structured error
				try {
					const errorData = JSON.parse(args.error.serverError)
					if (
						errorData.code &&
						AuthErrorMessages[errorData.code as AuthErrorCode]
					) {
						toast.error(AuthErrorMessages[errorData.code as AuthErrorCode])
						return
					}
				} catch {
					// Not a structured error, fall through to generic handling
				}

				// Fallback for non-structured errors
				toast.error('Account creation failed. Please try again later.')
			} else if (args.error.validationErrors) {
				toast.error(
					'Please check your information and ensure all required fields are filled correctly.',
				)
			} else {
				toast.error(
					'Something went wrong while creating your account. Please try again later.',
				)
			}
		},
		onSuccess() {
			toast.success(
				'Account created successfully! Please check your email for verification instructions.',
			)
			router.push('/sign-in')
		},
	})

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			organizationName: '',
			name: '',
			email: '',
			password: '',
		},
	})

	return (
		<Card className='w-full max-w-sm'>
			<CardHeader>
				<CardTitle>Create a new organization</CardTitle>
				<CardDescription>
					Enter your information below to get started
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id='sign-in-form'
						onSubmit={form.handleSubmit(execute)}
						className='space-y-4'>
						<FormField
							control={form.control}
							name='organizationName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization</FormLabel>
									<FormControl>
										<Input type='text' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input type='text' autoComplete='name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type='email' autoComplete='work email' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											autoComplete='current-password webauthn'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='flex-col gap-2'>
				<Button form='sign-in-form' type='submit' className='w-full'>
					{isExecuting && <Icons.loader className='animate-spin' />}
					Create
				</Button>
				<div className='mt-4 text-center text-sm'>
					Already have an account?{' '}
					<Link href='/sign-in' className='underline underline-offset-4'>
						Sign in
					</Link>
				</div>
			</CardFooter>
		</Card>
	)
}
