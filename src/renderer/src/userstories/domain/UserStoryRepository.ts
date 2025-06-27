import { UserStory } from "./userStory"

export interface UserStoryRepository {
    list(epicId: number): Promise<UserStory[]>
    listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]>
    get(id: number): Promise<UserStory>
    create(epic_id: number, name: string, rol: string, description: string, acceptance_criteria: string, dod: string, priority: string, story_points: number, dependencies: string, summary: string): Promise<UserStory>
    update(id: number, name: string, rol: string, description: string, acceptance_criteria: string, dod: string, priority: string, story_points: number, dependencies: string, status_user_stories: boolean | null, summary: string): Promise<UserStory>
    delete(id: number): Promise<void>
}