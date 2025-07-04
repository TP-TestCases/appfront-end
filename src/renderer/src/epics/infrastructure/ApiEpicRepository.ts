import { Epic } from '../domain/Epic'
import { EpicRepository } from '../domain/EpicRepository'

const API_URL = import.meta.env.VITE_API_URL

interface ApiEpicResponse {
    id: number
    fake_id: string
    name: string
    description: string
    project_id: number
}

export class ApiEpicRepository implements EpicRepository {
    constructor(private baseUrl: string = API_URL) { }

    private mapEpic(data: ApiEpicResponse): Epic {
        return {
            id: data.id,
            fake_id: data.fake_id,
            name: data.name,
            description: data.description,
            project_id: data.project_id
        }
    }

    async listByUser(userId: number): Promise<Epic[]> {
        const response = await fetch(`${this.baseUrl}/epics/user/${userId}`)
        if (!response.ok) {
            throw new Error('Failed to load epics by user')
        }
        const data: ApiEpicResponse[] = await response.json()
        return data.map((e: ApiEpicResponse) => this.mapEpic(e))
    }

    async list(project_id: number): Promise<Epic[]> {
        const response = await fetch(`${this.baseUrl}/epics/project/${project_id}`)
        if (!response.ok) {
            throw new Error('Failed to load epics')
        }
        const data: ApiEpicResponse[] = await response.json()
        return data.map((e: ApiEpicResponse) => this.mapEpic(e))
    }

    async listShort(project_id: number): Promise<{ id: number; fake_id: string; name: string }[]> {
        const response = await fetch(`${this.baseUrl}/epics/project/${project_id}/short`)
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
        const data: ApiEpicResponse = await response.json()
        return this.mapEpic(data)
    }

    async create(fake_id: string, name: string, description: string, project_id: number): Promise<Epic> {
        const response = await fetch(`${this.baseUrl}/epics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fake_id, name, description, project_id })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to create epic')
        }
        const data: ApiEpicResponse = await response.json()
        return this.mapEpic(data)
    }

    async update(id: number, name: string, description: string): Promise<Epic> {
        const response = await fetch(`${this.baseUrl}/epics/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to update epic')
        }
        const data: ApiEpicResponse = await response.json()
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