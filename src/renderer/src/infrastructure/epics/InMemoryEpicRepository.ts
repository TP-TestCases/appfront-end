import { Epic } from '@renderer/domain/epics/Epic'
import { EpicRepository } from '@renderer/domain/epics/EpicRepository'

export class InMemoryEpicRepository implements EpicRepository {
    private epics: Epic[]

    constructor(initial: Epic[] = []) {
        this.epics = initial
    }

    async getAll(): Promise<Epic[]> {
        return this.epics
    }

    async save(epic: Epic): Promise<void> {
        const idx = this.epics.findIndex((e) => e.second_id === epic.second_id)
        if (idx !== -1) {
            this.epics[idx] = epic
        } else {
            this.epics.push(epic)
        }
    }
}