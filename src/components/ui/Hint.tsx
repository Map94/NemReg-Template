import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './tooltip'

export function Hint({
	content,
	className,
}: {
	content: string
	className?: string
}) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipContent>{content}</TooltipContent>
				<TooltipTrigger>
					<Info className={cn('size-4', className)} />
				</TooltipTrigger>
			</Tooltip>
		</TooltipProvider>
	)
}
