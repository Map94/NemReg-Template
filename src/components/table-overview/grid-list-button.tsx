'use client'

import { Icons } from '../common/icons'
import { Button } from '../ui/button'

interface GridListButtonProps {
	isGridView: boolean
	onToggle: () => void
}

export function GridListButton({ isGridView, onToggle }: GridListButtonProps) {
	return (
		<Button size='icon' variant='ghost' onClick={onToggle}>
			{isGridView ? <Icons.listlayout /> : <Icons.grid />}
		</Button>
	)
}
