import { Epic } from '@renderer/domain/epics/Epic'
import { EpicRepository } from '@renderer/domain/epics/EpicRepository'
import { InMemoryEpicRepository } from '@renderer/infrastructure/epics/InMemoryEpicRepository'

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