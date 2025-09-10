import {
	Check,
	ChevronsUpDown,
	Eclipse,
	Home,
	Languages,
	ListPlus,
	Loader2,
	LogOut,
	MessageCircleQuestionMark,
	Moon,
	Plus,
	Settings2,
	Sparkle,
	Sun,
	User,
	Warehouse,
} from 'lucide-react'
import React from 'react'

type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
	moon: (props: IconProps) => <Moon {...props} />,
	sun: (props: IconProps) => <Sun {...props} />,
	sparkle: (props: IconProps) => <Sparkle {...props} />,
	plus: (props: IconProps) => <Plus {...props} />,
	home: (props: IconProps) => <Home {...props} />,
	settings: (props: IconProps) => <Settings2 {...props} />,
	languages: (props: IconProps) => <Languages {...props} />,
	help: (props: IconProps) => <MessageCircleQuestionMark {...props} />,
	logout: (props: IconProps) => <LogOut {...props} />,
	user: (props: IconProps) => <User {...props} />,
	upDownChevron: (props: IconProps) => <ChevronsUpDown {...props} />,
	eclipse: (props: IconProps) => <Eclipse {...props} />,
	warehouse: (props: IconProps) => <Warehouse {...props} />,
	check: (props: IconProps) => <Check {...props} />,
	loader: (props: IconProps) => <Loader2 {...props} />,
	logo: (props: IconProps) => <ListPlus {...props} />,
	table: (props: React.SVGProps<SVGSVGElement>) => (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path d='M12 3v18' />
			<rect width='18' height='18' x='3' y='3' rx='2' />
			<path d='M3 9h18' />
			<path d='M3 15h18' />
		</svg>
	),
	eye: (props: React.SVGProps<SVGSVGElement>) => (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
			<circle cx='12' cy='12' r='3' />
		</svg>
	),
	edit: (props: React.SVGProps<SVGSVGElement>) => (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
			<path d='m15 5 4 4' />
		</svg>
	),
	heart: (props: React.SVGProps<SVGSVGElement>) => (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z' />
		</svg>
	),
	archive: (props: React.SVGProps<SVGSVGElement>) => (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<rect width='20' height='5' x='2' y='3' rx='1' />
			<path d='M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8' />
			<path d='m9.5 11 5 5' />
			<path d='m14.5 11-5 5' />
		</svg>
	),
}
