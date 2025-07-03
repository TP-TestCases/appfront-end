import { Epic } from './Epic'

export interface EpicRepository {
    listByUser(userId: number): Promise<Epic[]>
    list(project_id: number): Promise<Epic[]>
    listShort(project_id: number): Promise<{ id: number; fake_id: string; name: string }[]>
    create(fake_id: string, name: string, description: string, project_id: number): Promise<Epic>
    update(id: number, name: string, description: string): Promise<Epic>
    delete(id: number): Promise<void>
}