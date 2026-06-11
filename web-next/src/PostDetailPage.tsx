'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchPost, PostDetail } from "./api/posts"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import Link from "next/link"
import { Alert, AlertDescription } from "./components/ui/alert"


function PostDetailPage() {
    const params = useParams<{ id: string }>()
    const postId = Number(params.id)
    
    const [post, setPost] = useState<PostDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadPost() {
            if (!Number.isInteger(postId) || postId <= 0) {
                setPost(null)
                setError('잘못된 게시글 번호입니다.')
                return
            }
            
            try {
                setLoading(true)
                setError('')
                
                const result = await fetchPost(postId)
                setPost(result)
            } catch (err) {
                setPost(null)
                setError(err instanceof Error ? err.message : '게시글 조회에 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        
        loadPost()
    }, [postId])
    
    return (
        <main>
            <Card>
                <CardHeader>
                    <CardTitle>게시글 상세</CardTitle>
                    
                    {post && (
                        <CardDescription>
                            작성자 {post.user_id} · {new Date(post.created_at).toLocaleString()}
                        </CardDescription>
                    )}
                    
                    <CardAction>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/">목록</Link>
                            </Button>
                            
                            {post &&  (
                                <Button asChild>
                                    <Link href={`/posts/${post.id}/edit`}>수정</Link>
                                </Button>
                            )}
                        </div>
                    </CardAction>
                </CardHeader>
                
                <CardContent>
                    {loading && <p>불러오는 중..</p>}
                    
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {post && (
                        <article className="grid gap-4">
                            <h1 className="text-xl font-semibold">{post.title}</h1>
                            
                            <div className="text-sm text-muted-foreground">
                                수정일 {new Date(post.updated_at).toLocaleString()}
                            </div>
                            
                            <p className="whitespace-pre-wrap leading-7">
                                {post.content}
                            </p>
                        </article>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}
export default PostDetailPage