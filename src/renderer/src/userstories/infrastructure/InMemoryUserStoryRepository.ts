import { UserStory } from "../domain/userStory";
import { UserStoryRepository } from "../domain/UserStoryRepository";

export class InMemoryUserStoryRepository implements UserStoryRepository {
    private stories: UserStory[]

    constructor(initialStories: UserStory[] = []) {
        this.stories = initialStories
    }

    async listByUser(userId: number): Promise<UserStory[]> {
        return this.stories.filter((s) => s.epicId === userId)
    }

    async list(epicId: number): Promise<UserStory[]> {
        return this.stories.filter((s) => s.epicId === epicId)
    }

    async listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        return this.stories
            .filter((s) => s.epicId === epicId)
            .map((s) => ({ id: s.id, second_id: s.fakeId, name: s.nombre }))
    }

    async get(id: number): Promise<UserStory> {
        const story = this.stories.find((s) => s.id === id)
        if (!story) throw new Error('User story not found')
        return story
    }

    async create(epicId: number, fakeId: string, nombre: string, rol: string, descripcion: string, criterios: string, dod: string, prioridad: string, puntos: number, dependencias: string, resumen: string): Promise<UserStory> {
        const nextId = this.stories.length ? Math.max(...this.stories.map((s) => s.id)) + 1 : 1
        const newStory: UserStory = {
            id: nextId,
            epicId,
            fakeId,
            nombre,
            rol,
            descripcion,
            criterios,
            dod,
            prioridad,
            puntos,
            dependencias,
            resumen
        }
        this.stories.push(newStory)
        return newStory
    }

    async update(id: number, nombre: string, rol: string, descripcion: string, criterios: string, dod: string, prioridad: string, puntos: number, dependencias: string, resumen: string): Promise<UserStory> {
        const story = await this.get(id)
        story.nombre = nombre
        story.rol = rol
        story.descripcion = descripcion
        story.criterios = criterios
        story.dod = dod
        story.prioridad = prioridad
        story.puntos = puntos
        story.dependencias = dependencias
        story.resumen = resumen
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