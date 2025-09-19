'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A stacked area chart'

function randomBetween(factor: number) {
	return Math.floor(Math.random() * factor)
}

function getChartData() {
	return [
		{
			month: 'January',
			desktop: randomBetween(100),
			mobile: randomBetween(400),
		},
		{
			month: 'February',
			desktop: randomBetween(100),
			mobile: randomBetween(400),
		},
		{
			month: 'March',
			desktop: randomBetween(100),
			mobile: randomBetween(400),
		},
		{
			month: 'April',
			desktop: randomBetween(100),
			mobile: randomBetween(400),
		},
		{
			month: 'May',
			desktop: randomBetween(100),
			mobile: randomBetween(400),
		},
		{
			month: 'June',
			desktop: randomBetween(100),
			mobile: randomBetween(400),
		},
		{
			month: 'July',
			desktop: randomBetween(100),
			mobile: randomBetween(400),
		},
	].map(item => ({
		...item,
		total: item.desktop + item.mobile,
	}))
}

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: 'var(--chart-5)',
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
				data={getChartData()}
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
					stackId='b'
				/>
				<Area
					dataKey='total'
					type='natural'
					fill='none'
					fillOpacity={0}
					stroke='var(--color-total)'
					strokeWidth={0}
					activeDot={false}
					stackId='a'
				/>
			</AreaChart>
		</ChartContainer>
	)
}
