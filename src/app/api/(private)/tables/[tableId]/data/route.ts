import { authService } from '@/service/auth/service'
import { tableService } from '@/service/table/service'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/(private)/tables/[tableId]/data
export async function GET(
	request: NextRequest,
	{ params }: { params: { tableId: string } },
) {
	try {
		const auth = await authService.verify()
		if (!auth.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { tableId } = params
		const searchParams = request.nextUrl.searchParams
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '10')
		const offset = (page - 1) * limit

		const data = await tableService.getTableData(auth.tenant!.id, {
			tableId,
			limit,
			offset,
		})

		return NextResponse.json({
			success: true,
			data: data,
			pagination: {
				page,
				limit,
				total: data.length,
				pages: Math.ceil(data.length / limit),
				hasNext: data.length === limit,
				hasPrev: page > 1,
			},
			meta: {
				tableId,
				tenantId: auth.tenant?.id,
			},
		})
	} catch (error) {
		console.error(`Error fetching data for table ${params.tableId}:`, error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

// POST - Insert new record
export async function POST(
	request: NextRequest,
	{ params }: { params: { tableId: string } },
) {
	try {
		const auth = await authService.verify()
		if (!auth.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { tableId } = params
		const body = await request.json()

		const result = await tableService.insertTableRow(auth.tenant!.id, {
			tableId,
			data: body,
		})

		if (result) {
			return NextResponse.json(
				{
					success: true,
					message: 'Record created successfully',
				},
				{ status: 201 },
			)
		} else {
			return NextResponse.json(
				{
					error: 'Failed to create record',
				},
				{ status: 400 },
			)
		}
	} catch (error) {
		console.error(`Error creating record in table ${params.tableId}:`, error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

/*
import { authService } from '@/service/auth/service'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/(private)/tables/[tableId]/data - Get data for a specific table
export async function GET(
	request: NextRequest,
	{ params }: { params: { tableId: string } },
) {
	try {
		// Step 1: Authenticate user
		const auth = await authService.verify()
		if (!auth.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Step 2: Get the tableId from URL params
		const { tableId } = params

		// Step 3: Get pagination parameters
		const searchParams = request.nextUrl.searchParams
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '10')
		const search = searchParams.get('search') || ''

		// TODO: Implement real database query to fetch table data
		// This should query the dynamic table created by the user

		return NextResponse.json({
			success: true,
			data: [],
			pagination: {
				page,
				limit,
				total: 0,
				pages: 0,
				hasNext: false,
				hasPrev: false,
			},
			meta: {
				tableId,
				search,
				tenantId: auth.tenant?.id,
			},
		})
	} catch (error) {
		console.error(`Error fetching data for table ${params.tableId}:`, error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

// POST /api/(private)/tables/[tableId]/data - Add new record to table
export async function POST(
	request: NextRequest,
	{ params }: { params: { tableId: string } },
) {
	try {
		// Step 1: Authenticate user
		const auth = await authService.verify()
		if (!auth.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Step 2: Get table ID and parse request body
		const { tableId } = params
		const body = await request.json()

		// TODO: Implement real database insert
		// This should insert into the dynamic table created by the user

		return NextResponse.json(
			{
				success: true,
				data: {
					id: Date.now().toString(),
					...body,
					tableId,
					tenantId: auth.tenant?.id,
					createdBy: auth.user.id,
					createdAt: new Date().toISOString(),
				},
				message: 'Record created successfully',
			},
			{ status: 201 },
		)
	} catch (error) {
		console.error(`Error creating record in table ${params.tableId}:`, error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

*/
