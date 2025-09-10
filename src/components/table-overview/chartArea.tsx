'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A stacked area chart'

const chartData = [
	{ month: 'January', desktop: 200, mobile: 80, total: 200 + 80 },
	{ month: 'February', desktop: 305, mobile: 200, total: 305 + 200 },
	{ month: 'March', desktop: 237, mobile: 120, total: 237 + 120 },
	{ month: 'April', desktop: 73, mobile: 190, total: 73 + 190 },
	{ month: 'May', desktop: 209, mobile: 130, total: 209 + 130 },
	{ month: 'June', desktop: 214, mobile: 140, total: 214 + 140 },
	{ month: 'July', desktop: 269, mobile: 169, total: 269 + 169 },
]

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: 'var(--chart-1)',
	},
	mobile: {
		label: 'Mobile',
		color: 'var(--chart-2)',
	},
	total: {
		label: 'Total',
		color: 'red',
	},
} satisfies ChartConfig

export function ChartAreaAxes() {
	return (
		<ChartContainer config={chartConfig} className='h-[100px] w-full'>
			<AreaChart
				accessibilityLayer
				data={chartData}
				margin={{
					left: 2,
					right: 2,
				}}>
				<CartesianGrid vertical={false} />
				<XAxis dataKey='month' hide />
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<Area
					dataKey='mobile'
					type='natural'
					fill='var(--color-mobile)'
					fillOpacity={0.4}
					stroke='var(--color-mobile)'
					stackId='a'
				/>
				<Area
					dataKey='desktop'
					type='natural'
					fill='var(--color-desktop)'
					fillOpacity={0.4}
					stroke='var(--color-desktop)'
					stackId='a'
				/>
				<Area
					dataKey='total'
					type='natural'
					fill='none'
					fillOpacity={0}
					stroke='var(--color-total)'
					strokeWidth={0}
					activeDot={false}
					stackId='b'
				/>
			</AreaChart>
		</ChartContainer>
	)
}
