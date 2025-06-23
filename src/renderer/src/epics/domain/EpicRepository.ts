import { Epic } from './Epic'

export interface EpicRepository {
    getAll(): Promise<Epic[]>
    save(epic: Epic): Promise<void>
}