import { UserStory } from "../domain/userStory";
import { UserStoryRepository } from "../domain/UserStoryRepository";

export class InMemoryUserStoryRepository implements UserStoryRepository {
    private stories: UserStory[]

    constructor(initialStories: UserStory[] = []) {
        this.stories = initialStories
    }

    async listByUser(userId: number): Promise<UserStory[]> {
        return this.stories.filter((s) => s.epic_id === userId)
    }

    async list(epicId: number): Promise<UserStory[]> {
        return this.stories.filter((s) => s.epic_id === epicId)
    }

    async listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        return this.stories
            .filter((s) => s.epic_id === epicId)
            .map((s) => ({ id: s.id, second_id: s.second_id, name: s.name }))
    }

    async get(id: number): Promise<UserStory> {
        const story = this.stories.find((s) => s.id === id)
        if (!story) throw new Error('User story not found')
        return story
    }

    async create(epic_id: number, name: string, rol: string, description: string, acceptance_criteria: string, dod: string, priority: string, story_points: number, dependencies: string, summary: string): Promise<UserStory> {
        const nextId = this.stories.length ? Math.max(...this.stories.map((s) => s.id)) + 1 : 1
        const newStory: UserStory = {
            id: nextId,
            epic_id,
            epic_second_id: '',
            second_id: String(nextId),
            name,
            rol,
            description,
            acceptance_criteria,
            dod,
            priority,
            story_points,
            dependencies,
            summary,
            status_user_stories: true,
            createdAt: new Date().toISOString(),
            updatedAt: null
        }
        this.stories.push(newStory)
        return newStory
    }

    async update(id: number, name: string, rol: string, description: string, acceptance_criteria: string, dod: string, priority: string, story_points: number, dependencies: string, status_user_stories: boolean | null, summary: string): Promise<UserStory> {
        const story = await this.get(id)
        story.name = name
        story.rol = rol
        story.description = description
        story.acceptance_criteria = acceptance_criteria
        story.dod = dod
        story.priority = priority
        story.story_points = story_points
        story.dependencies = dependencies
        story.summary = summary
        if (status_user_stories !== null) {
            story.status_user_stories = status_user_stories
        }
        story.updatedAt = new Date().toISOString()
        return story
    }

    async delete(id: number): Promise<void> {
        this.stories = this.stories.filter((s) => s.id !== id)
    }
}