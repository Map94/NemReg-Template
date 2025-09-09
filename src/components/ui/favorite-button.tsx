'use client'

import { Icons } from '@/components/common/icons'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface FavoriteButtonProps {
	tableId: string
}

export function FavoriteButton({ tableId }: FavoriteButtonProps) {
	const [isFavorite, setIsFavorite] = useState(false)

	const toggleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation()
		e.preventDefault()
		setIsFavorite(prev => !prev)
		// Here you can add logic to persist favorites to localStorage, database, etc.
	}

	return (
		<Button
			size='icon'
			variant='ghost'
			onClick={toggleFavorite}
			className='h-6 w-6'>
			<Icons.star
				className={`size-4 transition-colors ${
					isFavorite
						? 'fill-yellow-400 text-yellow-400'
						: 'text-muted-foreground hover:text-yellow-400'
				}`}
			/>
		</Button>
	)
}
