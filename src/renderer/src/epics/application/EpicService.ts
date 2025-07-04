import { Epic } from "../domain/Epic"
import { EpicRepository } from "../domain/EpicRepository"

interface PaginatedEpicResponse {
    items: Epic[]
    total: number
    page: number
    size: number
    pages: number
}

export class EpicService {
    constructor(private repository: EpicRepository) { }

    listByUser(userId: number, page?: number, size?: number): Promise<PaginatedEpicResponse> {
        return this.repository.listByUser(userId, page, size)
    }

    list(project_id: number, page?: number, size?: number): Promise<PaginatedEpicResponse> {
        return this.repository.list(project_id, page, size)
    }

    listShort(project_id: number): Promise<{ id: number; fake_id: string; name: string }[]> {
        return this.repository.listShort(project_id)
    }

    get(id: number): Promise<Epic> {
        return this.repository.get(id)
    }

    create(fake_id: string, name: string, description: string, project_id: number): Promise<Epic> {
        return this.repository.create(fake_id, name, description, project_id)
    }

    update(id: number, name: string, description: string): Promise<Epic> {
        return this.repository.update(id, name, description)
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id)
    }
}