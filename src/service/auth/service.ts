import { db } from '@/lib/database/connection'
import { generateRandomString, slugify } from '@/lib/utils'
import { SignInInput, SignUpInput } from '@/schemas/auth'
import { authStore } from '@/store/auth/data'
import {
	AccountProvider,
	Session,
	SessionPlatform,
	Tenant,
	User,
} from '@/store/auth/models'
import { AuthErrorCode, StoreError } from '@/store/error'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { addDays, isWithinInterval, subDays } from 'date-fns'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'session'

export const authService = {
	verify: async function (): Promise<
		| {
				session: Session
				user: User
				tenant: Tenant
		  }
		| {
				session: null
				user: null
				tenant: null
		  }
	> {
		const cookieStore = await cookies()

		const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value
		if (!sessionCookie) {
			return { session: null, user: null, tenant: null }
		}

		const session = await authStore.getSession(sessionCookie)
		if (!session) {
			return { session: null, user: null, tenant: null }
		}

		const closeToExpired = isWithinInterval(new Date(), {
			start: subDays(session.expiresAt, 1),
			end: session.expiresAt,
		})
		if (closeToExpired) {
			await authStore.extendSession(session.id)
		}

		const user = await authStore.getUserById(session.userId)
		if (!user) {
			return { session: null, user: null, tenant: null }
		}

		const tenant = await authStore.getTenant(user.tenantId)
		if (!tenant) {
			return { session: null, user: null, tenant: null }
		}

		return { session, user, tenant }
	},
	authorizeCredentials: async function (input: SignInInput): Promise<User> {
		const { email, password } = input

		const user = await authStore.getUserByEmail(email)
		if (!user) {
			throw new StoreError(AuthErrorCode.USER_NOT_FOUND)
		}

		const account = await authStore.getAccount(
			user.id,
			AccountProvider.Credential,
		)
		if (!account) {
			throw new StoreError(AuthErrorCode.ACCOUNT_NOT_FOUND)
		}

		if (!account.passwordHash) {
			throw new StoreError(
				'Password hash is null',
				AuthErrorCode.PASSWORD_HASH_NULL,
			)
		}
		const samePassword = await bcrypt.compare(password, account.passwordHash)
		if (!samePassword) {
			throw new StoreError(AuthErrorCode.INVALID_CREDENTIALS)
		}

		return user
	},
	createSession: async function (
		id: User['id'],
		platform: SessionPlatform,
		duration = 7,
	): Promise<Session> {
		const expiresAt = addDays(new Date(), duration)
		const token = randomBytes(64).toString('hex')
		return authStore.createSession({
			id: generateRandomString(32, 'session_'),
			userId: id,
			token: token,
			expiresAt: expiresAt,
			platform: platform,
		})
	},
	setSessionCookie: async function (token: Session['token']): Promise<void> {
		const expiry = addDays(new Date(), 7)
		const cookieStore = await cookies()
		cookieStore.set(SESSION_COOKIE, token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			expires: expiry,
			path: '/',
		})
	},
	registerTenant: async function (
		input: SignUpInput,
	): Promise<{ tenant: Tenant; user: User }> {
		const { organizationName, name, email, password } = input

		try {
			const transaction = await db.transaction(async tx => {
				const newTenant = await authStore.createTenant(
					{
						id: generateRandomString(32, 'tenant_'),
						name: organizationName,
						slug: slugify(organizationName),
					},
					tx,
				)

				const newAdminUser = await authStore.createUser(
					{
						id: generateRandomString(32, 'user_'),
						name,
						email,
						tenantId: newTenant.id,
						active: true,
						emailVerified: true,
					},
					tx,
				)

				const passwordHash = await bcrypt.hash(password, 12)

				await authStore.createAccount(
					{
						id: generateRandomString(32, 'account_'),
						provider: AccountProvider.Credential,
						userId: newAdminUser.id,
						passwordHash: passwordHash,
					},
					tx,
				)

				return { tenant: newTenant, user: newAdminUser }
			})

			return transaction
		} catch (error: any) {
			if (
				error.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
				error.message?.includes('UNIQUE constraint failed')
			) {
				if (error.message?.includes('email')) {
					throw new StoreError(AuthErrorCode.EMAIL_ALREADY_EXISTS)
				}
				if (
					error.message?.includes('slug') ||
					error.message?.includes('name')
				) {
					throw new StoreError(AuthErrorCode.ORGANIZATION_NAME_EXISTS)
				}
			}

			throw new StoreError(AuthErrorCode.UNKNOWN_ERROR)
		}
	},
	registerUser: async function () {},
	invalidateSession: async function (
		token: Session['token'],
	): Promise<boolean> {
		const cookieStore = await cookies()
		cookieStore.set(SESSION_COOKIE, token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			expires: 0,
			path: '/',
		})

		return authStore.deleteSession(token)
	},
}
