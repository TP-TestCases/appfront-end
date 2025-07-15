import { UserStory } from '../domain/userStory'
import { UserStoryRepository } from '../domain/UserStoryRepository'
import { PaginationResponse } from '../../shared/hooks/usePagination'
import { HttpService } from '../../shared/services/HttpService'

export class ApiUserStoryRepository implements UserStoryRepository {
    private httpService: HttpService

    constructor() {
        this.httpService = HttpService.getInstance()
    }

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
        const response = await this.httpService.get(`/userstories/user/${userId}`)
        if (!response.ok) {
            throw new Error('Failed to load user stories by user')
        }
        const data = await response.json()
        return data.map((s: Parameters<ApiUserStoryRepository['mapStory']>[0]) => this.mapStory(s))
    }

    async listByUserPaginated(userId: number, page: number, size: number): Promise<PaginationResponse<UserStory>> {
        const response = await this.httpService.get(`/userstories/user/${userId}?page=${page}&size=${size}`)
        if (!response.ok) {
            throw new Error('Failed to load user stories by user')
        }
        const data = await response.json()
        return {
            items: data.items.map((s: Parameters<ApiUserStoryRepository['mapStory']>[0]) => this.mapStory(s)),
            total: data.total,
            page: data.page,
            pages: data.pages
        }
    }

    async listSimpleByUser(userId: number): Promise<{ id: number; fake_id: string }[]> {
        const response = await this.httpService.get(`/userstories/user/${userId}/simple`)
        if (!response.ok) {
            throw new Error('Failed to load simple user stories by user')
        }
        return await response.json()
    }

    async list(epicId: number): Promise<UserStory[]> {
        const response = await this.httpService.get(`/userstories/epic/${epicId}`)
        if (!response.ok) {
            throw new Error('Failed to load user stories')
        }
        const data = await response.json()
        return data.map((s: Parameters<ApiUserStoryRepository['mapStory']>[0]) => this.mapStory(s))
    }

    async listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        const response = await this.httpService.get(`/userstories/epic/${epicId}`)
        if (!response.ok) {
            throw new Error('Failed to load short user stories')
        }
        return await response.json()
    }

    async get(id: number): Promise<UserStory> {
        const response = await this.httpService.get(`/userstories/${id}`)
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'User story not found')
        }
        const data = await response.json()
        return this.mapStory(data)
    }

    async create(epicId: number, fakeId: string, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory> {
        const response = await this.httpService.post('/userstories', {
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
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to create user story')
        }
        const data = await response.json()
        return this.mapStory(data)
    }

    async update(id: number, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory> {
        const response = await this.httpService.put(`/userstories/${id}`, {
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
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to update user story')
        }
        const data = await response.json()
        return this.mapStory(data)
    }

    async delete(id: number): Promise<void> {
        const response = await this.httpService.delete(`/userstories/${id}`)
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to delete user story')
        }
    }

    async importFromExcel(projectId: number, file: File): Promise<void> {
        const formData = new FormData()
        formData.append('project_id', String(projectId))
        formData.append('file', file)

        const response = await this.httpService.postFormData('/import/epics-us/', formData)
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to import epics and user stories')
        }
    }
}