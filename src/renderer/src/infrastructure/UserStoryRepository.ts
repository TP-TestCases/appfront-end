import { UserStory } from '../domain/userStory'

export interface UserStoryRepository {
    list(): Promise<UserStory[]>
    save(stories: UserStory[]): Promise<void>
}