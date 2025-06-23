import { Epic } from "../domain/Epic"
import { EpicRepository } from "../domain/EpicRepository"
import { InMemoryEpicRepository } from "../infrastructure/InMemoryEpicRepository"

export class EpicService {
    private repository: EpicRepository

    constructor(repository?: EpicRepository) {
        this.repository = repository || new InMemoryEpicRepository()
    }

    async getEpics(): Promise<Epic[]> {
        return this.repository.getAll()
    }

    async saveEpic(epic: Epic): Promise<void> {
        return this.repository.save(epic)
    }
}