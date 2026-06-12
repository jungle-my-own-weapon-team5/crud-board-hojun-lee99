'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createPost } from "./api/posts"
import { fetchBoards, type BoardListItem } from "./api/boards"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Alert, AlertDescription } from "./components/ui/alert"

type FormState = {
    board_id: number
    title: string
    content: string
}

const initialForm: FormState = {
    board_id: 0,
    title: '',
    content: '',
}

function PostCreatePage() {
    const router = useRouter()

    const [form, setForm] = useState<FormState>(initialForm)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [boards, setBoards] = useState<BoardListItem[]>([])
    const [boardsLoading, setBoardLoading] = useState(false)

    useEffect(() => {
        async function loadBoards() {
            try {
                setBoardLoading(true)
                const result = await fetchBoards()
                setBoards(result.items)
            } catch (err) {
                setError(err instanceof Error ? err.message : '게시판 목록 조회에 실패했습니다.')
            } finally {
                setBoardLoading(false)
            }
        }

        loadBoards()
    }, [])

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const validateForm = () => {
        if (!form.board_id) return '게시판을 선택해주세요.'
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
                board_id: Number(form.board_id),
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
                    <Label htmlFor="board_id">게시판</Label>
                    <select
                        id="board_id"
                        name="board_id"
                        value={form.board_id}
                        onChange={handleChange}
                        disabled={loading || boardsLoading}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">
                            {boardsLoading ? '게시판 불러오는 중...' : '게시판을 선택해주세요'}
                        </option>

                        {boards.map((board) => (
                            <option key={board.id} value={String(board.id)}>
                                {board.name}
                            </option>
                        ))}
                    </select>

                </div>

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