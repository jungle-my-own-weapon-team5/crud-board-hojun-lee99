import { API_BASE_URL } from "./config"

export type BoardListItem = {
    id: number
    name: string
    description: string | null
    created_at: string
    updated_at: string
}

export type BoardListResponse = {
    items: BoardListItem[]
    total: number
}


export async function fetchBoards(): Promise<BoardListResponse> {
    const response = await fetch(`${API_BASE_URL}/boards`)
    
    if (!response.ok) {
        throw new Error('게시판 목록 조회에 실패했습니다.')
    }

    return response.json()
}