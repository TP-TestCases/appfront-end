import { UserStory } from "./userStory"

export interface UserStoryRepository {
    listByUser(userId: number): Promise<UserStory[]>
    list(epicId: number): Promise<UserStory[]>
    listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]>
    get(id: number): Promise<UserStory>
    create(epicId: number, fakeId: string, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory>
    update(id: number, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory>
    delete(id: number): Promise<void>
    importFromExcel(projectId: number, file: File): Promise<void>
}