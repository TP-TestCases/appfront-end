import { Epic } from "../domain/Epic"
import { EpicRepository } from "../domain/EpicRepository"

export class InMemoryEpicRepository implements EpicRepository {
    private epics: (Epic & { proyecto_id: number })[]

    constructor(initial: (Epic & { proyecto_id: number })[] = []) {
        this.epics = initial
    }

    async listByUser(): Promise<Epic[]> {
        return this.epics
    }

    async list(proyecto_id: number): Promise<Epic[]> {
        return this.epics.filter((e) => e.proyecto_id === proyecto_id)
    }

    async listShort(proyecto_id: number): Promise<{ id: number; fake_id: string; nombre: string }[]> {
        return this.epics
            .filter((e) => e.proyecto_id === proyecto_id)
            .map((e) => ({ id: e.id, fake_id: e.fake_id, nombre: e.nombre }))
    }

    async get(id: number): Promise<Epic> {
        const epic = this.epics.find((e) => e.id === id)
        if (!epic) throw new Error('Epic not found')
        return epic
    }

    async create(fake_id: string, nombre: string, descripcion: string, proyecto_id: number): Promise<Epic> {
        const nextId = this.epics.length ? Math.max(...this.epics.map((e) => e.id)) + 1 : 1
        const newEpic = { id: nextId, fake_id, nombre, descripcion, proyecto_id }
        this.epics.push(newEpic)
        return newEpic
    }

    async update(id: number, nombre: string, descripcion: string): Promise<Epic> {
        const epic = await this.get(id)
        epic.nombre = nombre
        epic.descripcion = descripcion
        return epic
    }

    async delete(id: number): Promise<void> {
        this.epics = this.epics.filter((e) => e.id !== id)
    }
}