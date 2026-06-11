'use client'

import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { fetchPost, updatePost } from "./api/posts"
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Alert, AlertDescription } from "./components/ui/alert"
import { Button } from "./components/ui/button"

type FormState = {
    title: string
    content: string
}

function PostEditPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const postId = Number(params.id)

    const [form, setForm] = useState<FormState>({ title: '', content: ''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function loadPost() {
            if (!Number.isInteger(postId) || postId <= 0) {
                setError('잘못된 게시글 번호입니다.')
                return
            }

            try {
                setLoading(true)
                setError('')

                const post = await fetchPost(postId)
                setForm({
                    title: post.title,
                    content: post.content,
                })
            } catch (err) {
                setError(err instanceof Error ? err.message : '게시글 조회에 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        
        loadPost()
    }, [postId])

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        if (!form.title.trim()) {
            setError('제목을 입력해주세요.')
            return
        }
        
        if (form.title.length > 100) {
            setError('제목은 100자 이하로 입려하세요.')
            return
        }
        
        if (!form.content.trim()) {
            setError('내용을 입력해주세요.')
            return
        }
        
        try {
            setSaving(true)
            setError('')

            await updatePost(postId, {
                title: form.title.trim(),
                content: form.content.trim(),
            })
            
            router.push('/')
        } catch (err) {
            setError(err instanceof Error ? err.message : '게시글 수정에 실패했습니다.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <main>
            <h1>게시글 수정</h1>
            
            {loading ? (
                <p>불러오는 중...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="title">제목</Label>
                        <Input
                            id="title"
                            name="title"
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
                    

                    <Button type="button" onClick={() => router.push('/')} disabled={saving}>
                        취소
                    </Button>
                    
                    <Button type="submit" disabled={saving}>
                        {saving ? '수정 중...' : '수정'}
                    </Button>
                </form>
            )}
        </main>
    )
}


export default PostEditPage