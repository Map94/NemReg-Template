'use client'

import { signInAction } from '@/actions/auth'
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
import { signInValidation } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

export function SignInForm() {
	const router = useRouter()
	const t = useTranslations('validation')
	const signInSchema = signInValidation(t)

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof signInSchema>) {
		const response = await signInAction({ ...values })
		console.log('Response', response)
		if (response && response.serverError) {
			try {
				const errorData = JSON.parse(response.serverError)
				if (
					errorData.code &&
					AuthErrorMessages[errorData.code as AuthErrorCode]
				) {
					toast.error(AuthErrorMessages[errorData.code as AuthErrorCode])
					return
				}
			} catch {
				// Space left for generic fall backs...
			}

			toast.error('Sign in failed. Please check your email and password.')
			console.error(response.serverError)
			return
		}
		toast.success('Welcome back!')
		router.replace('/')
		router.refresh()
	}
	return (
		<Card className='w-full max-w-sm'>
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id='sign-in-form'
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Your email...' {...field} />
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
										<Input type='password' {...field} />
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
					Login
				</Button>
				<div className='mt-4 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='/sign-up' className='underline underline-offset-4'>
						Sign up
					</Link>
				</div>
			</CardFooter>
		</Card>
	)
}
