import { Epic } from '../domain/Epic'
import { EpicRepository } from '../domain/EpicRepository'
import { HttpService } from '../../shared/services/HttpService'

interface ApiEpicResponse {
    id: number
    fake_id: string
    name: string
    description: string
    project_id: number
}

interface PaginatedEpicResponse {
    items: ApiEpicResponse[]
    total: number
    page: number
    size: number
    pages: number
}

export class ApiEpicRepository implements EpicRepository {
    private httpService: HttpService

    constructor() {
        this.httpService = HttpService.getInstance()
    }

    private mapEpic(data: ApiEpicResponse): Epic {
        return {
            id: data.id,
            fake_id: data.fake_id,
            name: data.name,
            description: data.description,
            project_id: data.project_id
        }
    }

    async listByUser(userId: number, page: number = 1, size: number = 10): Promise<PaginatedEpicResponse> {
        const response = await this.httpService.get(`/epics/user/${userId}?page=${page}&size=${size}`)
        if (!response.ok) {
            throw new Error('Failed to load epics by user')
        }
        const data: PaginatedEpicResponse = await response.json()
        return {
            ...data,
            items: data.items.map((e: ApiEpicResponse) => this.mapEpic(e))
        }
    }

    async list(project_id: number, page: number = 1, size: number = 10): Promise<PaginatedEpicResponse> {
        const response = await this.httpService.get(`/epics/project/${project_id}?page=${page}&size=${size}`)
        if (!response.ok) {
            throw new Error('Failed to load epics')
        }
        const data: PaginatedEpicResponse = await response.json()
        return {
            ...data,
            items: data.items.map((e: ApiEpicResponse) => this.mapEpic(e))
        }
    }

    async listShort(project_id: number): Promise<{ id: number; fake_id: string; name: string }[]> {
        const response = await this.httpService.get(`/epics/project/${project_id}/short`)
        if (!response.ok) {
            throw new Error('Failed to load short epics')
        }
        const data = await response.json()
        console.log('listShort epics response data:', data)

        if (!Array.isArray(data)) {
            console.error('Expected array but got:', typeof data, data)
            if (data && data.items && Array.isArray(data.items)) {
                return data.items
            }
            throw new Error('Invalid response format: expected array of epics')
        }

        return data
    }

    async get(id: number): Promise<Epic> {
        const response = await this.httpService.get(`/epics/${id}`)
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Epic not found')
        }
        const data: ApiEpicResponse = await response.json()
        return this.mapEpic(data)
    }

    async create(fake_id: string, name: string, description: string, project_id: number): Promise<Epic> {
        const response = await this.httpService.post('/epics', {
            fake_id,
            name,
            description,
            project_id
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to create epic')
        }
        const data: ApiEpicResponse = await response.json()
        return this.mapEpic(data)
    }

    async update(id: number, name: string, description: string): Promise<Epic> {
        const response = await this.httpService.put(`/epics/${id}`, {
            name,
            description
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to update epic')
        }
        const data: ApiEpicResponse = await response.json()
        return this.mapEpic(data)
    }

    async delete(id: number): Promise<void> {
        const response = await this.httpService.delete(`/epics/${id}`)
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to delete epic')
        }
    }
}