export type PostListItem = {
    id: number
    user_id: number
    title: string
    created_at: string
    updated_at: string
}

export type PostDetail = {
    id: number
    user_id: number
    title: string
    content: string
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

export type PostCreateRequest = {
    title: string
    content: string
}

export type PostCreateResponse = {
    id: number
    user_id: number
    title: string
    content: string
    created_at: string
    updated_at: string
}

export type PostUpdateRequest = {
    title: string
    content: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

export async function fetchPosts(page:number, limit = 20): Promise<PostListResponse> {
    const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${limit}`)

    if (!response.ok) {
        throw new Error('게시글 목록 조회에 실패했습니다.')
    }

    return response.json()
}

export async function createPost(payload:PostCreateRequest): Promise<PostCreateResponse> {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
        throw new Error('로그인이 필요합니다.')
    }

    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => null)

        if (response.status == 401) {
            throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.')
        }

        if (Array.isArray(error?.detail)) {
            throw new Error(error.detail[0]?.msg ?? '입력값을 확인해주세요.')
        }

        throw new Error(error?.detail ?? '게시글 작성에 실패했습니다.')
    }

    return response.json()
}

export async function updatePost(postId:number, payload: PostUpdateRequest): Promise<void> {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
        throw new Error('로그인이 필요합니다.')
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(error?.detail ?? '게시글 수정에 실패했습니다.')
    }
    

    return
}