import { UserStory } from "./userStory"

export interface UserStoryRepository {
    listByUser(userId: number): Promise<UserStory[]>
    list(epicId: number): Promise<UserStory[]>
    listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]>
    get(id: number): Promise<UserStory>
    create(epicId: number, fakeId: string, nombre: string, rol: string, descripcion: string, criterios: string, dod: string, prioridad: string, puntos: number, dependencias: string, resumen: string): Promise<UserStory>
    update(id: number, nombre: string, rol: string, descripcion: string, criterios: string, dod: string, prioridad: string, puntos: number, dependencias: string, resumen: string): Promise<UserStory>
    delete(id: number): Promise<void>
    importFromExcel(projectId: number, file: File): Promise<void>
}