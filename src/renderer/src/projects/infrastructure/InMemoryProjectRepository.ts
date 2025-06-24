import { Project } from "../domain/Project"
import { ProjectRepository } from "../domain/ProjectRepository"

export class InMemoryProjectRepository implements ProjectRepository {
    private projects: Project[]

    constructor(initial: Project[] = []) {
        this.projects = initial
    }

    async list(userId: number): Promise<Project[]> {
        return this.projects.filter((p) => p.userId === userId)
    }

    async create(userId: number, name: string, description: string): Promise<Project> {
        const now = new Date().toISOString()
        const newProject: Project = {
            id: this.projects.length ? Math.max(...this.projects.map((p) => p.id)) + 1 : 1,
            userId,
            name,
            description,
            createdAt: now,
        }
        this.projects.push(newProject)
        return newProject
    }

    async update(id: number, name: string, description: string): Promise<Project> {
        const project = this.projects.find((p) => p.id === id)
        if (!project) throw new Error('Project not found')
        project.name = name
        project.description = description
        return project
    }

    async delete(id: number): Promise<void> {
        this.projects = this.projects.filter((p) => p.id !== id)
    }
}
