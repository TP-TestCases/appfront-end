import { Project } from '../domain/Project'
import { ProjectRepository } from '../domain/ProjectRepository'
import { PaginationResponse } from '../../shared/hooks/usePagination'
import { HttpService } from '../../shared/services/HttpService'

export class ApiProjectRepository implements ProjectRepository {
    private httpService: HttpService

    constructor() {
        this.httpService = HttpService.getInstance()
    }

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
        const response = await this.httpService.get(`/projects/user/${userId}`)
        if (!response.ok) {
            throw new Error('Failed to load projects')
        }
        const data = await response.json()
        return data.map((p: { id: number; name: string; description: string; user_id: number }) =>
            this.mapProject(p)
        )
    }

    async listShort(userId: number): Promise<{ id: number; name: string }[]> {
        const response = await this.httpService.get(`/projects/user/${userId}`)
        if (!response.ok) {
            throw new Error('Failed to load short projects')
        }
        const data = await response.json()
        console.log('listShort response data:', data)

        if (!Array.isArray(data)) {
            console.error('Expected array but got:', typeof data, data)
            if (data && data.items && Array.isArray(data.items)) {
                return data.items.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name }))
            }
            throw new Error('Invalid response format: expected array of projects')
        }

        return data.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name }))
    }

    async listByUser(userId: number, page: number, size: number): Promise<PaginationResponse<Project>> {
        const response = await this.httpService.get(`/projects/user/${userId}?page=${page}&size=${size}`)
        if (!response.ok) {
            throw new Error('Failed to load projects')
        }
        const data = await response.json()
        return {
            items: data.items.map((p: { id: number; name: string; description: string; user_id: number }) =>
                this.mapProject(p)
            ),
            total: data.total,
            page: data.page,
            pages: data.pages
        }
    }

    async create(userId: number, name: string, description: string): Promise<Project> {
        const response = await this.httpService.post('/projects/', {
            user_id: userId,
            name,
            description
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to create project')
        }
        const data = await response.json()
        return this.mapProject(data)
    }

    async update(id: number, name: string, description: string): Promise<Project> {
        const response = await this.httpService.put(`/projects/${id}`, {
            name,
            description
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to update project')
        }
        const data = await response.json()
        return this.mapProject(data)
    }

    async delete(id: number): Promise<void> {
        const response = await this.httpService.delete(`/projects/${id}`)
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to delete project')
        }
    }
}