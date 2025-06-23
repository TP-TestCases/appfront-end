import { UserStory } from '@renderer/domain/userstories/userStory'
import { UserStoryRepository } from './UserStoryRepository'

export class InMemoryUserStoryRepository implements UserStoryRepository {
    private stories: UserStory[]

    constructor(initialStories: UserStory[] = []) {
        this.stories = initialStories
    }

    async list(): Promise<UserStory[]> {
        return this.stories
    }

    async save(stories: UserStory[]): Promise<void> {
        this.stories = stories
    }
}