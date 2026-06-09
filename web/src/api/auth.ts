type RegisterRequest = {
    email: string,
    nickname: string,
    password: string,
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export async function registerUser(payload: RegisterRequest) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => null)

        if (Array.isArray(error?.detail)) {
            throw new Error(error.detail[0]?.msg ?? '입력값을 확인해주세요.')
        }

        throw new Error(error?.detail ?? '회원가입에 실패했습니다.')
    }

    return response.json()
}