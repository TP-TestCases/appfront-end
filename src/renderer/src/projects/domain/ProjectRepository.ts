import { Project } from "./Project"

export interface ProjectRepository {
    list(userId: number): Promise<Project[]>
    create(userId: number, name: string, description: string, status_project: boolean): Promise<Project>
    update(id: number, name: string, description: string, status_project: boolean): Promise<Project>
    delete(id: number): Promise<void>
}
