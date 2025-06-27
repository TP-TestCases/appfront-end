import { UserStory } from '../domain/userStory'
import { UserStoryRepository } from '../domain/UserStoryRepository'

const API_URL = import.meta.env.VITE_API_URL

export class ApiUserStoryRepository implements UserStoryRepository {
    constructor(private baseUrl: string = API_URL) { }

    private mapStory(data: {
        id: number
        epic_id: number
        second_id: string
        name: string
        rol: string
        description: string
        acceptance_criteria: string
        dod: string
        priority: string
        story_points: number
        dependencies: string
        summary: string
        status_user_stories: boolean | number | null
        created_at: string
        updated_at: string | null
    }): UserStory {
        return {
            id: data.id,
            epic_id: data.epic_id,
            second_id: data.second_id,
            name: data.name,
            rol: data.rol,
            description: data.description,
            acceptance_criteria: data.acceptance_criteria,
            dod: data.dod,
            priority: data.priority,
            story_points: data.story_points,
            dependencies: data.dependencies,
            summary: data.summary,
            status_user_stories: !!data.status_user_stories,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        }
    }

    async list(epicId: number): Promise<UserStory[]> {
        const response = await fetch(`${this.baseUrl}/user_stories/epic/${epicId}`)
        if (!response.ok) {
            throw new Error('Failed to load user stories')
        }
        const data = await response.json()
        return data.map((s: Parameters<ApiUserStoryRepository['mapStory']>[0]) => this.mapStory(s))
    }

    async listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        const response = await fetch(`${this.baseUrl}/user_stories/epic/${epicId}/short`)
        if (!response.ok) {
            throw new Error('Failed to load short user stories')
        }
        return await response.json()
    }

    async get(id: number): Promise<UserStory> {
        const response = await fetch(`${this.baseUrl}/user_stories/${id}`)
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'User story not found')
        }
        const data = await response.json()
        return this.mapStory(data)
    }

    async create(epic_id: number, name: string, rol: string, description: string, acceptance_criteria: string, dod: string, priority: string, story_points: number, dependencies: string, summary: string): Promise<UserStory> {
        const response = await fetch(`${this.baseUrl}/user_stories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                epic_id,
                name,
                rol,
                description,
                acceptance_criteria,
                dod,
                priority,
                story_points,
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

    async update(id: number, name: string, rol: string, description: string, acceptance_criteria: string, dod: string, priority: string, story_points: number, dependencies: string, status_user_stories: boolean | null, summary: string): Promise<UserStory> {
        const response = await fetch(`${this.baseUrl}/user_stories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                rol,
                description,
                acceptance_criteria,
                dod,
                priority,
                story_points,
                dependencies,
                status_user_stories,
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
        const response = await fetch(`${this.baseUrl}/user_stories/${id}`, { method: 'DELETE' })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to delete user story')
        }
    }
}