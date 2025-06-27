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

    async listShort(userId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        return this.projects
            .filter((p) => p.userId === userId)
            .map((p) => ({ id: p.id, second_id: p.id.toString(), name: p.name }))
    }

    async create(userId: number, name: string, description: string, status_project: boolean): Promise<Project> {
        const now = new Date().toISOString()
        const newProject: Project = {
            id: this.projects.length ? Math.max(...this.projects.map((p) => p.id)) + 1 : 1,
            userId,
            name,
            description,
            status_project,
            createdAt: now,
        }
        this.projects.push(newProject)
        return newProject
    }

    async update(id: number, name: string, description: string, status_project: boolean): Promise<Project> {
        const project = this.projects.find((p) => p.id === id)
        if (!project) throw new Error('Project not found')
        project.name = name
        project.description = description
        project.status_project = status_project
        return project
    }

    async delete(id: number): Promise<void> {
        this.projects = this.projects.filter((p) => p.id !== id)
    }
}
