import { Project } from '@renderer/domain/project/Project'
import { ProjectRepository } from '@renderer/domain/project/ProjectRepository'
import { InMemoryProjectRepository } from '@renderer/infrastructure/project/InMemoryProjectRepository'

export class ProjectService {
    private repository: ProjectRepository

    constructor(repository?: ProjectRepository) {
        this.repository = repository || new InMemoryProjectRepository()
    }

    async getProjects(): Promise<Project[]> {
        return this.repository.getAll()
    }

    async saveProject(project: Project): Promise<void> {
        return this.repository.save(project)
    }
}
