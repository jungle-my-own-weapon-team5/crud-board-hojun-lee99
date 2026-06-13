'use client'

import React, { useState } from "react"
import { loginUser } from "./api/auth"
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { toast } from "sonner"
import { Alert, AlertDescription } from "./components/ui/alert"
import { useRouter } from "next/navigation"

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

    const router = useRouter()

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
            toast.success('로그인되었습니다.')
            router.replace('/')
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
                <Label>
                    이메일
                    <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                </Label>

                <Label>
                    비밀번호
                    <Input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                </Label>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                <Button type="submit" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </Button>
            </form>
        </main>
    )
}

export default LoginPage