import { UserStory } from "../domain/userStory"
import { UserStoryRepository } from "../infrastructure/UserStoryRepository"

export class UserStoryService {
    constructor(private repository: UserStoryRepository) { }

    async getStories(): Promise<UserStory[]> {
        return this.repository.list()
    }

    async saveStories(stories: UserStory[]): Promise<void> {
        await this.repository.save(stories)
    }
}
