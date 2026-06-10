export type PostListItem = {
    id: number
    user_id: number
    title: string
    created_at: string
    updated_at: string
}

export type PostListResponse = {
    items: PostListItem[]
    page: number
    limit: number
    total: number
    total_pages: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export async function fetchPosts(page:number, limit = 20): Promise<PostListResponse> {
    const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${limit}`)

    if (!response.ok) {
        throw new Error('게시글 목록 조회에 실패했습니다.')
    }

    return response.json()
}