import React, { useState } from "react"
import { loginUser } from "./api/auth"

type FormState = {
    email: string
    password: string
}

const initialForm: FormState = {
    email: '',
    password: '',
}

function LoginPage() {
    const [form, setForm] = useState<FormState>(initialForm)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const validateForm = () => {
        if (!form.email.trim()) return '이메일을 입력해주세요.'
        if (!form.password) return '비밀번호를 입력해주세요.'

        return ''
    }

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            setLoading(true)

            await loginUser({
                email: form.email,
                password: form.password,
            })

            setForm(initialForm)
            alert('로그인되었습니다.')
        } catch (err) {
            setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <h1>로그인</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    이메일
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                </label>

                <label>
                    비밀번호
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                </label>

                {error && <p role="alert">{error}</p>}
                
                <button type="submit" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>
        </main>
    )
}

export default LoginPage