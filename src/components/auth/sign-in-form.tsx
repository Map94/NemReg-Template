'use client'

import { signInAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export function SignInForm() {
	const router = useRouter()
	const t = useTranslations('Auth')
	const authT = useTranslations('auth')
	const validationT = useTranslations('validation')

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { execute, isExecuting } = useAction(signInAction, {
		onSuccess: () => {
			toast.success(authT('success.signIn'))
			// Redirect to dashboard after successful login
			router.push('/')
		},
		onError: ({ error }) => {
			if (error.serverError) {
				const errorKey = error.serverError
				// Try to get translated error message, fallback to generic message
				const errorMessage =
					authT(`errors.${errorKey}`) || authT('errors.UNKNOWN_ERROR')
				toast.error(errorMessage)
			}
		},
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Basic client-side validation
		if (!email) {
			toast.error(validationT('required'))
			return
		}
		if (!password) {
			toast.error(validationT('password.required'))
			return
		}

		execute({ email, password })
	}

	return (
		<Card className='mx-auto max-w-md w-full'>
			<CardHeader className='space-y-2'>
				<CardTitle className='text-2xl font-bold'>{t('signInTitle')}</CardTitle>
				<CardDescription className='text-base'>
					{t('signInDescription')}
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>{t('email')}</Label>
						<Input
							id='email'
							type='email'
							placeholder={t('emailPlaceholder')}
							value={email}
							onChange={e => setEmail(e.target.value)}
							disabled={isExecuting}
							className='h-11'
							required
						/>
					</div>
					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='password'>{t('password')}</Label>
							<Link
								href='#'
								className='text-sm text-primary underline-offset-4 hover:underline'>
								{t('forgotPassword')}
							</Link>
						</div>
						<Input
							id='password'
							type='password'
							placeholder={t('passwordPlaceholder')}
							value={password}
							onChange={e => setPassword(e.target.value)}
							disabled={isExecuting}
							className='h-11'
							required
						/>
					</div>
					<div className='space-y-3'>
						<Button
							type='submit'
							className='w-full h-11'
							disabled={isExecuting}>
							{isExecuting ? t('signingIn') : t('signInButton')}
						</Button>
					</div>
				</form>
				<div className='text-center text-sm text-muted-foreground'>
					{t('dontHaveAccount')}{' '}
					<Link
						href='/sign-up'
						className='font-medium text-primary underline-offset-4 hover:underline'>
						{t('signUp')}
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
