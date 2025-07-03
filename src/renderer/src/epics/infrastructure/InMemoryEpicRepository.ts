import { Epic } from "../domain/Epic"
import { EpicRepository } from "../domain/EpicRepository"

export class InMemoryEpicRepository implements EpicRepository {
    private epics: (Epic & { project_id: number })[]

    constructor(initial: (Epic & { project_id: number })[] = []) {
        this.epics = initial
    }

    async listByUser(): Promise<Epic[]> {
        return this.epics
    }

    async list(project_id: number): Promise<Epic[]> {
        return this.epics.filter((e) => e.project_id === project_id)
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