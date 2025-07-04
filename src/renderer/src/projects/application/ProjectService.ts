import { Project } from "../domain/Project"
import { ProjectRepository } from "../domain/ProjectRepository"
import { InMemoryProjectRepository } from "../infrastructure/InMemoryProjectRepository"
import { PaginationResponse } from "../../shared/hooks/usePagination"

export class ProjectService {
    private repository: ProjectRepository

    constructor(repository: ProjectRepository = new InMemoryProjectRepository()) {
        this.repository = repository
    }

    list(userId: number): Promise<Project[]> {
        return this.repository.list(userId)
    }

    listByUser(userId: number, page: number, size: number): Promise<PaginationResponse<Project>> {
        return this.repository.listByUser(userId, page, size)
    }

    create(userId: number, name: string, description: string): Promise<Project> {
        return this.repository.create(userId, name, description)
    }

    update(id: number, name: string, description: string): Promise<Project> {
        return this.repository.update(id, name, description)
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id)
    }
}