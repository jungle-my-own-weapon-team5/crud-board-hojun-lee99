import { API_BASE_URL } from "./config"

export type CommentListItem = {
    id: number
    post_id: number
    user_id: number
    content: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export type CommentListResponse = {
    items: CommentListItem[]
    total: number
}

export async function fetchComments(postId:number): Promise<CommentListResponse> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`)

    if (!response.ok) {
        throw new Error('댓글 조회에 실패했습니다.')
    }

    return response.json()
}

export type CommentCreateRequest = {
    content: string
}

export type CommentCreateResponse = CommentListItem

export async function createComment(postId:number, payload: CommentCreateRequest): Promise<CommentCreateResponse> {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
        throw new Error('로그인이 필요합니다.')
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
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
            throw new Error(error.detail[0]?.msg ?? '댓글 내용을 확인해주세요.')
        }
        
        throw new Error(error?.detail ?? '댓글 작성에 실패했습니다.')
    }
    
    return response.json()
}