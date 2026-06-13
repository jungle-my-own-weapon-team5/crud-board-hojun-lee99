'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchPost, PostDetail } from "./api/posts"
import { fetchComments, CommentListItme } from "./api/comments"
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
    const [comments, setComments] = useState<CommentListItme[]>([])
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [commentsError, setCommentsError] = useState('')

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
            
            try {
                setCommentsLoading(true)
                setCommentsError('')

                const commentsResult = await fetchComments(postId)
                setComments(commentsResult.items)
            } catch (err) {
                setComments([])
                setCommentsError(err instanceof Error ? err.message : '댓글 조회에 실패했습니다.')
            } finally {
                setCommentsLoading(false)
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

                    {post && (
                        <section className="mt-8 border-t pt-6">
                            <h2 className="mb-4 text-lg font-semibold">
                                댓글 {comments.length}
                            </h2>
                            
                            {commentsLoading && <p>댓글을 불러오는 중...</p>}

                            {commentsError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{commentsError}</AlertDescription>
                                </Alert>
                            )}

                            {!commentsLoading && !commentsError && comments.length == 0 && (
                                <p className="text-sm text-muted-foreground">아직 댓글이 없습니다.</p>
                            )}
                            
                            <ul className="divide-y">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="py-4">
                                        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                                            <span>작성자 {comment.user_id}</span>
                                            <time dateTime={comment.created_at}>
                                                {new Date(comment.created_at).toLocaleString()}
                                            </time>
                                        </div>

                                        <p className="whitespace-pre-wrap leading-6">
                                            {comment.content}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}
export default PostDetailPage