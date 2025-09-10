import { AuthErrorCode } from '@/store/error'

export function handleAuthError(
	serverError: string,
	authT: (key: string) => string,
): string {
	try {
		const errorData = JSON.parse(serverError)
		if (
			errorData.code &&
			Object.values(AuthErrorCode).includes(errorData.code)
		) {
			return authT(`errors.${errorData.code}`)
		}
	} catch {
		if (
			serverError.match(/^[A-Z_]+$/) &&
			Object.values(AuthErrorCode).includes(serverError as AuthErrorCode)
		) {
			return authT(`errors.${serverError}`)
		}
	}

	return authT('errors.UNKNOWN_ERROR')
}
