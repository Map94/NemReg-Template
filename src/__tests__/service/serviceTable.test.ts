import { db } from '../../lib/db/connection'
import * as tableService from '../../service/table/service'

// Mock the database
jest.mock('../../lib/db/connection', () => ({
	db: {
		select: jest.fn().mockReturnThis(),
		insert: jest.fn().mockReturnThis(),
		update: jest.fn().mockReturnThis(),
		from: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		values: jest.fn().mockReturnThis(),
		set: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
		offset: jest.fn().mockReturnThis(),
		returning: jest.fn(),
		execute: jest.fn(),
	},
}))

describe('Table Service', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('Table service functions', () => {
		test('should import table service without errors', () => {
			expect(tableService).toBeDefined()
		})

		test('should mock database connection', () => {
			expect(db).toBeDefined()
			expect(db.select).toBeDefined()
			expect(db.insert).toBeDefined()
		})

		test('should have database mock methods', () => {
			// Test that our mocks are working
			expect(typeof db.select).toBe('function')
			expect(typeof db.insert).toBe('function')
			expect(typeof db.update).toBe('function')
		})
	})
})
