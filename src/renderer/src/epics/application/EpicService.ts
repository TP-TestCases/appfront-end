import { Epic } from "../domain/Epic"
import { EpicRepository } from "../domain/EpicRepository"
import { InMemoryEpicRepository } from "../infrastructure/InMemoryEpicRepository"

export class EpicService {
    constructor(private repository: EpicRepository = new InMemoryEpicRepository()) { }

    listByUser(userId: number): Promise<Epic[]> {
        return this.repository.listByUser(userId)
    }

    list(project_id: number): Promise<Epic[]> {
        return this.repository.list(project_id)
    }

    create(fake_id: string, name: string, description: string, project_id: number): Promise<Epic> {
        return this.repository.create(fake_id, name, description, project_id)
    }

    update(id: number, name: string, description: string): Promise<Epic> {
        return this.repository.update(id, name, description)
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id)
    }
}