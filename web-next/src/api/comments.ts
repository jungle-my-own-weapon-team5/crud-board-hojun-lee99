import { API_BASE_URL } from "./config"

export type CommentListItme = {
    id: number
    post_id: number
    user_id: number
    content: string
    created_at: string
    updated_at: string
    deleted_at: string
}

export type CommentListResponse = {
    items: CommentListItme[]
    total: number
}

export async function fetchComments(postId:number): Promise<CommentListResponse> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`)

    if (!response.ok) {
        throw new Error('댓글 조회에 실패했습니다.')
    }

    return response.json()
}