import { Project } from '@renderer/domain/project/Project'
import { ProjectRepository } from '@renderer/domain/project/ProjectRepository'

export class InMemoryProjectRepository implements ProjectRepository {
    private projects: Project[]

    constructor(initial: Project[] = []) {
        this.projects = initial
    }

    async getAll(): Promise<Project[]> {
        return this.projects
    }

    async save(project: Project): Promise<void> {
        const idx = this.projects.findIndex((p) => p.id === project.id)
        if (idx !== -1) {
            this.projects[idx] = project
        } else {
            this.projects.push(project)
        }
    }
}
