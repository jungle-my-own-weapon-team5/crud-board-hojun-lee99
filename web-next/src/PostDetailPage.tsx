'use client'

import { useParams } from "next/navigation"
import { SubmitEvent, useEffect, useState } from "react"
import { fetchPost, PostDetail } from "./api/posts"
import { fetchComments, CommentListItem, createComment } from "./api/comments"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import Link from "next/link"
import { Alert, AlertDescription } from "./components/ui/alert"
import { Label } from "./components/ui/label"
import { Textarea } from "./components/ui/textarea"


function PostDetailPage() {
    const params = useParams<{ id: string }>()
    const postId = Number(params.id)
    
    const [post, setPost] = useState<PostDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [comments, setComments] = useState<CommentListItem[]>([])
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [commentsError, setCommentsError] = useState('')
    const [commentContent, setCommentContent] = useState('')
    const [commentSubmitting, setCommentSubmitting] = useState(false)
    const [commentSubmitError, setCommentSubmitError] = useState('')

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
    
    const handleCommentSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setCommentSubmitError('')

        const content = commentContent.trim()
        if (!content) {
            setCommentSubmitError('댓글 내용을 입력해주세요.')
            return
        }

        try {
            setCommentSubmitting(true)

            const createdComment = await createComment(postId, { content })
            setComments((prev) => [...prev, createdComment])
            setCommentContent('')
            setCommentsError('')
        } catch (err) {
            setCommentSubmitError(err instanceof Error ? err.message : '댓글 작성에 실패했습니다.')
        } finally {
            setCommentSubmitting(false)
        }
    }
    
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

                            <form onSubmit={handleCommentSubmit} className="mb-6 grid gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="comment-content">댓글 작성</Label>
                                    <Textarea
                                        id="comment-content"
                                        value={commentContent}
                                        onChange={(event) => setCommentContent(event.target.value)}
                                        rows={3}
                                        disabled={commentSubmitting}
                                        placeholder="댓글을 입력하세요."
                                    />
                                </div>

                                {commentSubmitError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{commentSubmitError}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={commentSubmitting || !commentContent.trim()}>
                                        {commentSubmitting ? '등록 중...' : '댓글 등록'}
                                    </Button>
                                </div>
                            </form>
                            
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