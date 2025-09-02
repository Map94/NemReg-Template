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

export class StoreError extends Error {
	public code?: string

	constructor(message: string, code?: string) {
		super(message)
		this.code = code ?? message
		this.name = 'StoreError'
	}
}
