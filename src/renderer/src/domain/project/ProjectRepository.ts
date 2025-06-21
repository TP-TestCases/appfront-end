import { Project } from '@renderer/domain/project/Project'

export interface ProjectRepository {
    getAll(): Promise<Project[]>
    save(project: Project): Promise<void>
}
