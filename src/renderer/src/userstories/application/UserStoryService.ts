import { UserStory } from "../domain/userStory"
import { UserStoryRepository } from "../domain/UserStoryRepository"

export class UserStoryService {
    constructor(private repository: UserStoryRepository) { }

    list(epicId: number): Promise<UserStory[]> {
        return this.repository.list(epicId)
    }

    listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        return this.repository.listShort(epicId)
    }

    get(id: number): Promise<UserStory> {
        return this.repository.get(id)
    }

    create(epic_id: number, name: string, rol: string, description: string, acceptance_criteria: string, dod: string, priority: string, story_points: number, dependencies: string, summary: string): Promise<UserStory> {
        return this.repository.create(epic_id, name, rol, description, acceptance_criteria, dod, priority, story_points, dependencies, summary)
    }

    update(id: number, name: string, rol: string, description: string, acceptance_criteria: string, dod: string, priority: string, story_points: number, dependencies: string, status_user_stories: boolean | null, summary: string): Promise<UserStory> {
        return this.repository.update(id, name, rol, description, acceptance_criteria, dod, priority, story_points, dependencies, status_user_stories, summary)
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id)
    }
}
