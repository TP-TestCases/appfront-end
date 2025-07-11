import { Epic } from "../domain/Epic"
import { EpicRepository } from "../domain/EpicRepository"

export class InMemoryEpicRepository implements EpicRepository {
    private epics: Epic[]

    constructor(initial: Epic[] = []) {
        this.epics = initial
    }

    async listByUser(userId: number): Promise<Epic[]> {
        return this.epics.filter((e) => e.user_id === userId)
    }

    async list(projectId: number): Promise<Epic[]> {
        return this.epics.filter((e) => e.project_id === projectId)
    }

    async listShort(projectId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        return this.epics
            .filter((e) => e.project_id === projectId)
            .map((e) => ({ id: e.id, second_id: e.second_id, name: e.name }))
    }

    async get(id: number): Promise<Epic> {
        const epic = this.epics.find((e) => e.id === id)
        if (!epic) throw new Error('Epic not found')
        return epic
    }

    async create(projectId: number, name: string, description: string): Promise<Epic> {
        const nextId = this.epics.length ? Math.max(...this.epics.map((e) => e.id)) + 1 : 1
        const newEpic: Epic = {
            id: nextId,
            user_id: null,
            project_id: projectId,
            project_name: '',
            second_id: nextId.toString(),
            name,
            description,
            status_epic: true,
            createdAt: new Date().toISOString(),
            updatedAt: null
        }
        this.epics.push(newEpic)
        return newEpic
    }

    async update(id: number, name: string, description: string, status_epic: boolean | null): Promise<Epic> {
        const epic = await this.get(id)
        epic.name = name
        epic.description = description
        if (status_epic !== null) {
            epic.status_epic = status_epic
        }
        epic.updatedAt = new Date().toISOString()
        return epic
    }

    async delete(id: number): Promise<void> {
        this.epics = this.epics.filter((e) => e.id !== id)
    }
}