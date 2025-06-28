import { Project } from "../domain/Project"
import { ProjectRepository } from "../domain/ProjectRepository"
import { InMemoryProjectRepository } from "../infrastructure/InMemoryProjectRepository"

export class ProjectService {
    private repository: ProjectRepository

    constructor(repository: ProjectRepository = new InMemoryProjectRepository()) {
        this.repository = repository
    }

    list(usuarioId: number): Promise<Project[]> {
        return this.repository.list(usuarioId)
    }

    create(usuarioId: number, nombre: string, descripcion: string): Promise<Project> {
        return this.repository.create(usuarioId, nombre, descripcion)
    }

    update(id: number, nombre: string, descripcion: string): Promise<Project> {
        return this.repository.update(id, nombre, descripcion)
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id)
    }
}