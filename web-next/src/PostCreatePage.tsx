'use client'

import React, { useState } from "react"
import { createPost } from "./api/posts"
import { useRouter } from "next/navigation"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Alert, AlertDescription } from "./components/ui/alert"

type FormState = {
    title: string
    content: string
}

const initialForm: FormState = {
    title: '',
    content: '',
}

function PostCreatePage() {
    const router = useRouter()

    const [form, setForm] = useState<FormState>(initialForm)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const validateForm = () => {
        if (!form.title.trim()) return '제목을 입력해주세요.'
        if (form.title.length > 100) return '제목은 100자 이하로 입력해주세요.'
        if (!form.content.trim()) return '내용을 입력해주세요.'

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

            await createPost({
                title: form.title.trim(),
                content: form.content.trim(),
            })

            setForm(initialForm)
            router.push('/')
        } catch (err) {
            setError(err instanceof Error ? err.message : '게시글 작성에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <h1>게시글 작성</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={100}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="content">내용</Label>
                    <Textarea
                        id="content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        rows={10}
                    />
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button type="button" onClick={() => router.push('/')} disabled={loading}>
                    취소
                </Button>

                <Button type="submit" disabled={loading}>
                    {loading ? '작성 중...' : '작성'}
                </Button>
            </form>
        </main>
    )
}

export default PostCreatePage