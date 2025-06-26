import { Epic } from "../domain/Epic"
import { EpicRepository } from "../domain/EpicRepository"
import { InMemoryEpicRepository } from "../infrastructure/InMemoryEpicRepository"

export class EpicService {
    constructor(private repository: EpicRepository = new InMemoryEpicRepository()) { }

    list(projectId: number): Promise<Epic[]> {
        return this.repository.list(projectId)
    }

    create(projectId: number, name: string, description: string): Promise<Epic> {
        return this.repository.create(projectId, name, description)
    }

    update(id: number, name: string, description: string, status_epic: boolean | null): Promise<Epic> {
        return this.repository.update(id, name, description, status_epic)
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id)
    }
}