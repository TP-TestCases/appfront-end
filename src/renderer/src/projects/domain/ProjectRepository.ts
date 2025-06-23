import { Project } from "./Project"

export interface ProjectRepository {
    getAll(): Promise<Project[]>
    save(project: Project): Promise<void>
}
