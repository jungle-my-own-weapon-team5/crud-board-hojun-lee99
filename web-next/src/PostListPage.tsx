'use client'

import { useEffect, useState } from "react";
import { deletePost, fetchPosts, type PostListResponse } from "./api/posts";
import Link from "next/link";
import { Button } from "./components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./components/ui/pagination";

function PostListPage() {
    const [page, setPage] = useState(1)
    const [data, setData] = useState<PostListResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [deletingId, setDeletingId] = useState<number | null>(null)

    async function loadPosts() {
        try {
            setLoading(true)
            setError('')

            const result = await fetchPosts(page, 20)
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }
        
    useEffect(() => {
        loadPosts()
    }, [page])

    const posts = data?.items ?? []
    const totalPages = data?.total_pages ?? 0
    const displayTotalPages = Math.max(totalPages, 1);
    const handleDelete = async (postId: number) => {
        const confirmed = window.confirm('게시글을 삭제하시겠습니까?')

        if (!confirmed) return

        try {
            setDeletingId(postId)
            setError('')
            
            await deletePost(postId)
            await loadPosts()
        } catch (err) {
            setError(err instanceof Error ? err.message : '게시글 삭제에 실패했습니다.')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <main>
            <Card>
                <CardHeader>
                    <CardTitle>게시글 목록</CardTitle>
                
                    <CardAction>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/login">로그인</Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/register">회원가입</Link>
                            </Button>

                            <Button asChild>
                                <Link href="/posts/new">글쓰기</Link>
                            </Button>
                        </div>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    {loading && <p>불러오는 중...</p>}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    <p>총 {data?.total ?? 0}개</p>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>번호</TableHead>
                                <TableHead>제목</TableHead>
                                <TableHead>작성자</TableHead>
                                <TableHead>작성일</TableHead>
                                <TableHead>관리</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>{post.id}</TableCell>
                                    <TableCell>{post.title}</TableCell>
                                    <TableCell>{post.user_id}</TableCell>
                                    <TableCell>{new Date(post.created_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/posts/${post.id}/edit`}>수정</Link>
                                            </Button>
                                            
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                type="button"
                                                disabled={deletingId === post.id}
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                {deletingId === post.id ? '삭제 중...' : '삭제'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    text="이전"
                                    aria-disabled={page <= 1}
                                    className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        if (page > 1) setPage(page - 1);
                                    }}
                                />
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    isActive
                                    className="min-w-20 px-16"
                                    onClick={(event) => event.preventDefault()}
                                >
                                    {page} / {displayTotalPages}
                                </PaginationLink>
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    text="다음"
                                    aria-disabled={page >= totalPages}
                                    className={
                                        page >= displayTotalPages ? "pointer-events-none opacity-50" : undefined
                                    }
                                    onClick={(event) => {
                                        event.preventDefault();
                                        if (page < totalPages) setPage(page + 1);
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardContent>
            </Card>
        </main>
    )
}

export default PostListPage