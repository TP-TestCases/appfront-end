import { UserStory } from "../domain/userStory";
import { UserStoryRepository } from "../domain/UserStoryRepository";
import { PaginationResponse } from "../../shared/hooks/usePagination";

export class InMemoryUserStoryRepository implements UserStoryRepository {
    private stories: UserStory[]

    constructor(initialStories: UserStory[] = []) {
        this.stories = initialStories
    }

    async listByUser(userId: number): Promise<UserStory[]> {
        return this.stories.filter((s) => s.epic_id === userId)
    }

    async listByUserPaginated(userId: number, page: number, size: number): Promise<PaginationResponse<UserStory>> {
        const userStories = this.stories.filter((s) => s.epic_id === userId);
        const total = userStories.length;
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const items = userStories.slice(startIndex, endIndex);
        const pages = Math.ceil(total / size);

        return {
            items,
            total,
            page,
            pages
        };
    }

    async list(epicId: number): Promise<UserStory[]> {
        return this.stories.filter((s) => s.epic_id === epicId)
    }

    async listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        return this.stories
            .filter((s) => s.epic_id === epicId)
            .map((s) => ({ id: s.id, second_id: s.fakeId, name: s.name }))
    }

    async get(id: number): Promise<UserStory> {
        const story = this.stories.find((s) => s.id === id)
        if (!story) throw new Error('User story not found')
        return story
    }

    async create(epic_id: number, fakeId: string, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory> {
        const nextId = this.stories.length ? Math.max(...this.stories.map((s) => s.id)) + 1 : 1
        const newStory: UserStory = {
            id: nextId,
            epic_id,
            fakeId,
            name,
            role,
            description,
            criteria,
            dod,
            priority,
            points,
            dependencies,
            summary
        }
        this.stories.push(newStory)
        return newStory
    }

    async update(id: number, name: string, role: string, description: string, criteria: string, dod: string, priority: string, points: number, dependencies: string, summary: string): Promise<UserStory> {
        const story = await this.get(id)
        story.name = name
        story.role = role
        story.description = description
        story.criteria = criteria
        story.dod = dod
        story.priority = priority
        story.points = points
        story.dependencies = dependencies
        story.summary = summary
        return story
    }

    async delete(id: number): Promise<void> {
        this.stories = this.stories.filter((s) => s.id !== id)
    }

    async importFromExcel(projectId: number, file: File): Promise<void> {
        void projectId
        void file
    }
}