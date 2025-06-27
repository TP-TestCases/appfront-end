import { Epic } from '../domain/Epic'
import { EpicRepository } from '../domain/EpicRepository'

const API_URL = import.meta.env.VITE_API_URL

export class ApiEpicRepository implements EpicRepository {
    constructor(private baseUrl: string = API_URL) { }

    private mapEpic(data: {
        id: number;
        project_id: number;
        project_name: string;
        second_id: string;
        name: string;
        description: string;
        status_epic: boolean | number | null;
        created_at: string;
        updated_at: string;
    }): Epic {
        return {
            id: data.id,
            project_id: data.project_id,
            project_name: data.project_name,
            second_id: data.second_id,
            name: data.name,
            description: data.description,
            status_epic: !!data.status_epic,
            createdAt: data.created_at,
            updatedAt: data.updated_at
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

    async list(projectId: number): Promise<Epic[]> {
        const response = await fetch(`${this.baseUrl}/epics/project/${projectId}`)
        if (!response.ok) {
            throw new Error('Failed to load epics')
        }
        const data = await response.json()
        return data.map((e: Parameters<ApiEpicRepository['mapEpic']>[0]) => this.mapEpic(e))
    }

    async listShort(projectId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        const response = await fetch(`${this.baseUrl}/epics/project/${projectId}/short`)
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

    async create(projectId: number, name: string, description: string): Promise<Epic> {
        const response = await fetch(`${this.baseUrl}/epics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId, name, description })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to create epic')
        }
        const data = await response.json()
        return this.mapEpic(data)
    }

    async update(id: number, name: string, description: string, status_epic: boolean | null): Promise<Epic> {
        const response = await fetch(`${this.baseUrl}/epics/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, status_epic })
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