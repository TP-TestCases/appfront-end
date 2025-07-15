import { Epic } from "../domain/Epic"
import { EpicRepository } from "../domain/EpicRepository"

interface PaginatedEpicResponse {
    items: Epic[]
    total: number
    page: number
    size: number
    pages: number
}

export class InMemoryEpicRepository implements EpicRepository {
    private epics: (Epic & { project_id: number })[]

    constructor(initial: (Epic & { project_id: number })[] = []) {
        this.epics = initial
    }

    async listByUser(_userId: number, page: number = 1, size: number = 10): Promise<PaginatedEpicResponse> {
        const startIndex = (page - 1) * size
        const endIndex = startIndex + size
        const paginatedItems = this.epics.slice(startIndex, endIndex)
        const total = this.epics.length
        const pages = Math.ceil(total / size)

        return {
            items: paginatedItems,
            total,
            page,
            size,
            pages
        }
    }

    async list(project_id: number, page: number = 1, size: number = 10): Promise<PaginatedEpicResponse> {
        const filteredEpics = this.epics.filter((e) => e.project_id === project_id)
        const startIndex = (page - 1) * size
        const endIndex = startIndex + size
        const paginatedItems = filteredEpics.slice(startIndex, endIndex)
        const total = filteredEpics.length
        const pages = Math.ceil(total / size)

        return {
            items: paginatedItems,
            total,
            page,
            size,
            pages
        }
    }

    async listShort(project_id: number): Promise<{ id: number; fake_id: string; name: string }[]> {
        return this.epics
            .filter((e) => e.project_id === project_id)
            .map((e) => ({ id: e.id, fake_id: e.fake_id, name: e.name }))
    }

    async get(id: number): Promise<Epic> {
        const epic = this.epics.find((e) => e.id === id)
        if (!epic) throw new Error('Epic not found')
        return epic
    }

    async create(fake_id: string, name: string, description: string, project_id: number): Promise<Epic> {
        const nextId = this.epics.length ? Math.max(...this.epics.map((e) => e.id)) + 1 : 1
        const newEpic = { id: nextId, fake_id, name, description, project_id }
        this.epics.push(newEpic)
        return newEpic
    }

    async update(id: number, name: string, description: string): Promise<Epic> {
        const epic = await this.get(id)
        epic.name = name
        epic.description = description
        return epic
    }

    async delete(id: number): Promise<void> {
        this.epics = this.epics.filter((e) => e.id !== id)
    }
}