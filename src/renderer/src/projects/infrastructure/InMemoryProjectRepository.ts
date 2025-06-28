import { Project } from "../domain/Project"
import { ProjectRepository } from "../domain/ProjectRepository"

export class InMemoryProjectRepository implements ProjectRepository {
    private projects: Project[]

    constructor(initial: Project[] = []) {
        this.projects = initial
    }

    async list(usuarioId: number): Promise<Project[]> {
        return this.projects.filter((p) => p.usuario_id === usuarioId)
    }

    async listShort(usuarioId: number): Promise<{ id: number; nombre: string }[]> {
        return this.projects
            .filter((p) => p.usuario_id === usuarioId)
            .map((p) => ({ id: p.id, nombre: p.nombre }))
    }

    async create(usuarioId: number, nombre: string, descripcion: string): Promise<Project> {
        const newProject: Project = {
            id: this.projects.length ? Math.max(...this.projects.map((p) => p.id)) + 1 : 1,
            usuario_id: usuarioId,
            nombre,
            descripcion
        }
        this.projects.push(newProject)
        return newProject
    }

    async update(id: number, nombre: string, descripcion: string): Promise<Project> {
        const project = this.projects.find((p) => p.id === id)
        if (!project) throw new Error('Project not found')
        project.nombre = nombre
        project.descripcion = descripcion
        return project
    }

    async delete(id: number): Promise<void> {
        this.projects = this.projects.filter((p) => p.id !== id)
    }
}
