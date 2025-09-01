export enum AuthErrorCode {
	EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
	ORGANIZATION_NAME_EXISTS = 'ORGANIZATION_NAME_EXISTS',
	INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
	PASSWORD_HASH_NULL = 'PASSWORD_HASH_NULL',
	SESSION_CREATION_FAILED = 'SESSION_CREATION_FAILED',
	COOKIE_SET_FAILED = 'COOKIE_SET_FAILED',
	UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class StructuredError extends Error {
	constructor(
		public code: AuthErrorCode,
		message: string,
		public details?: any,
	) {
		super(message)
		this.name = 'StructuredError'
	}
}

export const AuthErrorMessages = {
	[AuthErrorCode.EMAIL_ALREADY_EXISTS]:
		'This email address is already registered. Please use a different email or try signing in.',
	[AuthErrorCode.ORGANIZATION_NAME_EXISTS]:
		'An organization with this name already exists. Please choose a different name.',
	[AuthErrorCode.INVALID_CREDENTIALS]:
		'Invalid email or password. Please check your credentials and try again.',
	[AuthErrorCode.USER_NOT_FOUND]:
		'Account not found. Please check your email or create a new account.',
	[AuthErrorCode.ACCOUNT_NOT_FOUND]:
		'Account configuration error. Please contact support.',
	[AuthErrorCode.PASSWORD_HASH_NULL]:
		'Account security error. Please contact support.',
	[AuthErrorCode.SESSION_CREATION_FAILED]:
		'Unable to sign you in right now. Please try again.',
	[AuthErrorCode.COOKIE_SET_FAILED]: 'Session setup failed. Please try again.',
	[AuthErrorCode.UNKNOWN_ERROR]:
		'Something went wrong while creating your account. Please try again later.',
} as const
