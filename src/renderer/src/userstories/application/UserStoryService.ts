import { UserStory } from "../domain/userStory"
import { UserStoryRepository } from "../domain/UserStoryRepository"
import { PaginationResponse } from "../../shared/hooks/usePagination"

export class UserStoryService {
    constructor(private repository: UserStoryRepository) { }

    listByUser(userId: number): Promise<UserStory[]> {
        return this.repository.listByUser(userId)
    }

    listByUserPaginated(userId: number, page: number, size: number): Promise<PaginationResponse<UserStory>> {
        return this.repository.listByUserPaginated(userId, page, size)
    }

    list(epicId: number): Promise<UserStory[]> {
        return this.repository.list(epicId)
    }

    listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        return this.repository.listShort(epicId)
    }

    get(id: number): Promise<UserStory> {
        return this.repository.get(id)
    }

    create(epicId: number, fakeId: string, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory> {
        return this.repository.create(epicId, fakeId, name, role, description, criteria, dod, priority, points, dependencies, summary)
    }

    update(id: number, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory> {
        return this.repository.update(id, name, role, description, criteria, dod, priority, points, dependencies, summary)
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id)
    }

    importFromExcel(projectId: number, file: File): Promise<void> {
        return this.repository.importFromExcel(projectId, file)
    }
}
