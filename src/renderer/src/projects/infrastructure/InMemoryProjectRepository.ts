import { Project } from "../domain/Project"
import { ProjectRepository } from "../domain/ProjectRepository"
import { PaginationResponse } from "../../shared/hooks/usePagination"

export class InMemoryProjectRepository implements ProjectRepository {
    private projects: Project[]

    constructor(initial: Project[] = []) {
        this.projects = initial
    }

    async list(userId: number): Promise<Project[]> {
        return this.projects.filter((p) => p.user_id === userId)
    }

    async listShort(userId: number): Promise<{ id: number; name: string }[]> {
        return this.projects
            .filter((p) => p.user_id === userId)
            .map((p) => ({ id: p.id, name: p.name }))
    }

    async listByUser(userId: number, page: number, size: number): Promise<PaginationResponse<Project>> {
        const userProjects = this.projects.filter((p) => p.user_id === userId)
        const total = userProjects.length
        const startIndex = (page - 1) * size
        const endIndex = startIndex + size
        const items = userProjects.slice(startIndex, endIndex)
        const pages = Math.ceil(total / size)

        return {
            items,
            total,
            page,
            pages
        }
    }

    async create(userId: number, name: string, description: string): Promise<Project> {
        const newProject: Project = {
            id: this.projects.length ? Math.max(...this.projects.map((p) => p.id)) + 1 : 1,
            user_id: userId,
            name,
            description
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
