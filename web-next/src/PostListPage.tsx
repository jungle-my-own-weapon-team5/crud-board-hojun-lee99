'use client'

import { useEffect, useState } from "react";
import { fetchPosts, type PostListResponse } from "./api/posts";
import { useRouter } from "next/navigation";

function PostListPage() {
    const router = useRouter();

    const [page, setPage] = useState(1)
    const [data, setData] = useState<PostListResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
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

        loadPosts()
    }, [page])

    const posts = data?.items ?? []
    const totalPages = data?.total_pages ?? 0

    return (
        <main>
            <h1>게시글 목록</h1>

            <button type="button" onClick={() => router.push("/posts/new")}>
                글쓰기
            </button>

            {loading && <p>불러오는 중...</p>}
            {error && <p role="alert">{error}</p>}
            
            <p>총 {data?.total ?? 0}개</p>

            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>

                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{post.user_id}</td>
                            <td>{new Date(post.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                이전
            </button>

            <span>
                {page} / {totalPages}
            </span>

            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                다음
            </button>
        </main>
    )
}

export default PostListPage