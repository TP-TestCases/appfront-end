import { Project } from '../domain/Project'
import { ProjectRepository } from '../domain/ProjectRepository'

const API_URL = import.meta.env.VITE_API_URL

export class ApiProjectRepository implements ProjectRepository {
    constructor(private baseUrl: string = API_URL) { }

    private mapProject(data: {
        id: number
        name: string
        description: string
        user_id: number
    }): Project {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            user_id: data.user_id
        }
    }

    async list(userId: number): Promise<Project[]> {
        const response = await fetch(`${this.baseUrl}/projects/user/${userId}`)
        if (!response.ok) {
            throw new Error('Failed to load projects')
        }
        const data = await response.json()
        return data.map((p: { id: number; name: string; description: string; user_id: number }) =>
            this.mapProject(p)
        )
    }

    async listShort(userId: number): Promise<{ id: number; name: string }[]> {
        const response = await fetch(`${this.baseUrl}/projects/user/${userId}`)
        if (!response.ok) {
            throw new Error('Failed to load short projects')
        }
        const data = await response.json()
        return data.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name }))
    }

    async create(userId: number, name: string, description: string): Promise<Project> {
        const response = await fetch(`${this.baseUrl}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, name, description })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to create project')
        }
        const data = await response.json()
        return this.mapProject(data)
    }

    async update(id: number, name: string, description: string): Promise<Project> {
        const response = await fetch(`${this.baseUrl}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to update project')
        }
        const data = await response.json()
        return this.mapProject(data)
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/projects/${id}`, { method: 'DELETE' })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to delete project')
        }
    }
}