import { Epic } from '../domain/Epic'
import { EpicRepository } from '../domain/EpicRepository'

const API_URL = import.meta.env.VITE_API_URL

export class ApiEpicRepository implements EpicRepository {
    constructor(private baseUrl: string = API_URL) { }

    private mapEpic(data: {
        id: number
        fake_id: string
        nombre: string
        descripcion: string
    }): Epic {
        return {
            id: data.id,
            fake_id: data.fake_id,
            nombre: data.nombre,
            descripcion: data.descripcion
        }
    }

    async listByUser(userId: number): Promise<Epic[]> {
        const response = await fetch(`${this.baseUrl}/epics/user/${userId}`)
        if (!response.ok) {
            throw new Error('Failed to load epics by user')
        }
        const data = await response.json()
        return data.map((e: Parameters<ApiEpicRepository['mapEpic']>[0]) => this.mapEpic(e))
    }

    async list(proyecto_id: number): Promise<Epic[]> {
        const response = await fetch(`${this.baseUrl}/epics/proyecto/${proyecto_id}`)
        if (!response.ok) {
            throw new Error('Failed to load epics')
        }
        const data = await response.json()
        return data.map((e: Parameters<ApiEpicRepository['mapEpic']>[0]) => this.mapEpic(e))
    }

    async listShort(proyecto_id: number): Promise<{ id: number; fake_id: string; nombre: string }[]> {
        const response = await fetch(`${this.baseUrl}/epics/proyecto/${proyecto_id}`)
        if (!response.ok) {
            throw new Error('Failed to load short epics')
        }
        return await response.json()
    }

    async get(id: number): Promise<Epic> {
        const response = await fetch(`${this.baseUrl}/epics/${id}`)
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Epic not found')
        }
        const data = await response.json()
        return this.mapEpic(data)
    }

    async create(fake_id: string, nombre: string, descripcion: string, proyecto_id: number): Promise<Epic> {
        const response = await fetch(`${this.baseUrl}/epics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fake_id, nombre, descripcion, proyecto_id })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to create epic')
        }
        const data = await response.json()
        return this.mapEpic(data)
    }

    async update(id: number, nombre: string, descripcion: string): Promise<Epic> {
        const response = await fetch(`${this.baseUrl}/epics/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to update epic')
        }
        const data = await response.json()
        return this.mapEpic(data)
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/epics/${id}`, { method: 'DELETE' })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to delete epic')
        }
    }
}