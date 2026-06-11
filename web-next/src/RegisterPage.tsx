'use client'

import React, { useState } from "react"
import { registerUser } from "./api/auth"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Alert, AlertDescription } from "./components/ui/alert"

type FormState = {
    email: string,
    nickname: string,
    password: string,
    passwordConfirm: string
}

const initialForm: FormState = {
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
}

function RegisterPage() {
    const [form, setForm] = useState<FormState>(initialForm)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    
    const validateForm = () => {
        if (!form.email.trim()) return '이메일을 입력해주세요.'
        if (!form.nickname.trim()) return '닉네임을 입력해주세요.'
        if (form.nickname.length < 2) return '닉네임은 2자 이상이어야 합니다.'
        if (form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
        if (form.password !== form.passwordConfirm) {
            return '비밀번호가 일치하지 않습니다.'
        }

        return ''
    }

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')
        setSuccess('')

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            setLoading(true)

            await registerUser({
                email: form.email,
                nickname: form.nickname,
                password: form.password,
            })

            setSuccess('회원가입이 완료되었습니다.')
            setForm(initialForm)
        } catch (err) {
            setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <h1>회원가입</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email"/>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="nickname">닉네임</Label>
                    <Input id="nickname" name="nickname" type="text" value={form.nickname} onChange={handleChange} autoComplete="nickname"/>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password"/>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                    <Input id="passwordConfirm" name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={handleChange} autoComplete="new-password"/>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && ( 
                    <Alert>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" disabled={loading}>
                    {loading ? '가입 중...' : '회원가입'}
                </Button>
            </form>
        </main>
    )
}

export default RegisterPage