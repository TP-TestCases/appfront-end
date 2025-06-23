import { Project } from "../domain/Project"
import { ProjectRepository } from "../domain/ProjectRepository"
import { InMemoryProjectRepository } from "../infrastructure/InMemoryProjectRepository"

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
