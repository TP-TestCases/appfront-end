import { UserStory } from '../domain/userStory'
import { UserStoryRepository } from '../domain/UserStoryRepository'

const API_URL = import.meta.env.VITE_API_URL

export class ApiUserStoryRepository implements UserStoryRepository {
    constructor(private baseUrl: string = API_URL) { }

    private mapStory(data: {
        id: number
        fake_id: string
        name: string
        role: string
        description: string
        criteria: string
        dod: string
        priority: string
        points: number
        dependencies: string
        summary: string
        epic_id: number
    }): UserStory {
        return {
            id: data.id,
            fakeId: data.fake_id,
            name: data.name,
            role: data.role,
            description: data.description,
            criteria: data.criteria,
            dod: data.dod,
            priority: data.priority,
            points: data.points,
            dependencies: data.dependencies,
            summary: data.summary,
            epic_id: data.epic_id
        }
    }

    async listByUser(userId: number): Promise<UserStory[]> {
        const response = await fetch(`${this.baseUrl}/userstories/user/${userId}`)
        if (!response.ok) {
            throw new Error('Failed to load user stories by user')
        }
        const data = await response.json()
        return data.map((s: Parameters<ApiUserStoryRepository['mapStory']>[0]) => this.mapStory(s))
    }

    async list(epicId: number): Promise<UserStory[]> {
        const response = await fetch(`${this.baseUrl}/userstories/epic/${epicId}`)
        if (!response.ok) {
            throw new Error('Failed to load user stories')
        }
        const data = await response.json()
        return data.map((s: Parameters<ApiUserStoryRepository['mapStory']>[0]) => this.mapStory(s))
    }

    async listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        const response = await fetch(`${this.baseUrl}/userstories/epic/${epicId}`)
        if (!response.ok) {
            throw new Error('Failed to load short user stories')
        }
        return await response.json()
    }

    async get(id: number): Promise<UserStory> {
        const response = await fetch(`${this.baseUrl}/userstories/${id}`)
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'User story not found')
        }
        const data = await response.json()
        return this.mapStory(data)
    }

    async create(epicId: number, fakeId: string, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory> {
        const response = await fetch(`${this.baseUrl}/userstories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                epic_id: epicId,
                fake_id: fakeId,
                name,
                role,
                description,
                criteria,
                dod,
                priority,
                points,
                dependencies,
                summary
            })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to create user story')
        }
        const data = await response.json()
        return this.mapStory(data)
    }

    async update(id: number, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory> {
        const response = await fetch(`${this.baseUrl}/userstories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                role,
                description,
                criteria,
                dod,
                priority,
                points,
                dependencies,
                summary
            })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to update user story')
        }
        const data = await response.json()
        return this.mapStory(data)
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/userstories/${id}`, { method: 'DELETE' })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to delete user story')
        }
    }

    async importFromExcel(projectId: number, file: File): Promise<void> {
        const formData = new FormData()
        formData.append('proyecto_id', String(projectId))
        formData.append('archivo', file)
        const response = await fetch(`${this.baseUrl}/importar/epics-us/`, {
            method: 'POST',
            body: formData
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to import epics and user stories')
        }
    }
}