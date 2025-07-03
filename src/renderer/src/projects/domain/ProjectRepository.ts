import { Project } from "./Project"

export interface ProjectRepository {
    list(userId: number): Promise<Project[]>
    listShort(userId: number): Promise<{ id: number; name: string }[]>
    create(userId: number, name: string, description: string): Promise<Project>
    update(id: number, name: string, description: string): Promise<Project>
    delete(id: number): Promise<void>
}
