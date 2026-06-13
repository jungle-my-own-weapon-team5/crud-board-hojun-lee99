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

export type CommentCreateRequest = {
    content: string
}

export type CommentCreateResponse = CommentListItem

export type CommentUpdateRequest = {
    content: string
}

export async function fetchComments(postId:number): Promise<CommentListResponse> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`)

    if (!response.ok) {
        throw new Error('댓글 조회에 실패했습니다.')
    }

    return response.json()
}

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

export async function updateComment(commentId: number, payload: CommentUpdateRequest) {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
        throw new Error('로그인이 필요합니다.')
    }

    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
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

        if (response.status == 403) {
            throw new Error('자신의 댓글만 수정할 수 있습니다.')
        }

        if (Array.isArray(error?.detail)) {
            throw new Error(error.detail[0]?.msg ?? '댓글 내용을 확인해주세요.')
        }
        
        throw new Error(error?.detail ?? '댓글 수정에 실패했습니다.')
    }

    return
}

export async function deleteComment(commentId: number): Promise<void> {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
        throw new Error('로그인이 필요합니다.')
    }

    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })
    
    if (!response.ok) {
        const error = await response.json().catch(() => null)

        if (response.status == 401) {
            throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.')
        }

        if (response.status == 403) {
            throw new Error('자신의 댓글만 삭제할 수 있습니다.')
        }

        throw new Error(error?.detail ?? '댓글 삭제에 실패했습니다.')
    }
}