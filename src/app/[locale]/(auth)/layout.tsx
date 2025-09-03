'use client'

import { Icons } from '@/components/common/icons'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Locale, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import React from 'react'

export default function AuthLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<main className='min-h-screen w-full bg-transparent relative overflow-hidden grid place-items-center'>
			<div className='absolute top-4 right-4 z-10'>
				<ActionButton />
			</div>
			<div
				className='absolute inset-0 z-0 pointer-events-none'
				style={{
					background: `
					   radial-gradient(
						 circle at top,
						 rgba(255, 255, 255, 0.08) 0%,
						 rgba(255, 255, 255, 0.08) 20%,
						 rgba(0, 0, 0, 0.0) 60%
					   )
					 `,
				}}
			/>
			<div className='flex w-full flex-col items-center gap-8'>
				<Logo />
				{children}
			</div>
		</main>
	)
}

function Logo() {
	return (
		<a href='#' className='flex items-center gap-2 self-center font-medium'>
			<div className='bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md'>
				<Icons.warehouse className='size-4' />
			</div>
			<span className='font-bold tracking-tight'>Nem Status</span>
		</a>
	)
}

function ActionButton() {
	const { setTheme, resolvedTheme } = useTheme()
	const router = useRouter()
	const locale = useLocale()
	const pathname = usePathname()

	const switchLocale = (newLocale: Locale) => {
		if (newLocale !== locale) {
			router.replace(pathname, { locale: newLocale })
			router.refresh()
		}
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='lg'>
					<Icons.eclipse className='h-4 w-4' />
					<span className='sr-only'>Settings</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start' className='w-56'>
				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<Icons.eclipse />
							Theme
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem onClick={() => setTheme('light')}>
									Light
									<Icons.check
										className={cn(
											'hidden ml-auto',
											resolvedTheme == 'light' && 'block',
										)}
									/>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme('dark')}>
									Dark
									<Icons.check
										className={cn(
											'hidden ml-auto',
											resolvedTheme == 'dark' && 'block',
										)}
									/>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<Icons.languages />
							Languages
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem onClick={() => switchLocale('en')}>
									English
									<Icons.check
										className={cn('hidden ml-auto', locale == 'en' && 'block')}
									/>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => switchLocale('da')}>
									Danish
									<Icons.check
										className={cn('hidden ml-auto', locale == 'da' && 'block')}
									/>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => switchLocale('no')}>
									Norwegian
									<Icons.check
										className={cn('hidden ml-auto', locale == 'no' && 'block')}
									/>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => switchLocale('swe')}>
									Swedish
									<Icons.check
										className={cn('hidden ml-auto', locale == 'swe' && 'block')}
									/>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
