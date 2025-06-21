import { UserStory } from "@renderer/domain/userstories/userStory"

export interface UserStoryRepository {
    list(): Promise<UserStory[]>
    save(stories: UserStory[]): Promise<void>
}