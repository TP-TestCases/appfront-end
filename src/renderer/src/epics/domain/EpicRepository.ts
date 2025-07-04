import { Epic } from './Epic'

interface PaginatedEpicResponse {
    items: Epic[]
    total: number
    page: number
    size: number
    pages: number
}

export interface EpicRepository {
    listByUser(userId: number, page?: number, size?: number): Promise<PaginatedEpicResponse>
    list(project_id: number, page?: number, size?: number): Promise<PaginatedEpicResponse>
    listShort(project_id: number): Promise<{ id: number; fake_id: string; name: string }[]>
    get(id: number): Promise<Epic>
    create(fake_id: string, name: string, description: string, project_id: number): Promise<Epic>
    update(id: number, name: string, description: string): Promise<Epic>
    delete(id: number): Promise<void>
}