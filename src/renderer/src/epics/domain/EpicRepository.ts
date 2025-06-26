import { Epic } from './Epic'

export interface EpicRepository {
    list(projectId: number): Promise<Epic[]>
    get(id: number): Promise<Epic>
    create(projectId: number, name: string, description: string): Promise<Epic>
    update(id: number, name: string, description: string, status_epic: boolean | null): Promise<Epic>
    delete(id: number): Promise<void>
}