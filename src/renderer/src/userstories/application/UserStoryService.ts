import { UserStory } from "../domain/userStory"
import { UserStoryRepository } from "../domain/UserStoryRepository"

export class UserStoryService {
    constructor(private repository: UserStoryRepository) { }

    listByUser(userId: number): Promise<UserStory[]> {
        return this.repository.listByUser(userId)
    }

    list(epicId: number): Promise<UserStory[]> {
        return this.repository.list(epicId)
    }

    listShort(epicId: number): Promise<{ id: number; second_id: string; name: string }[]> {
        return this.repository.listShort(epicId)
    }

    get(id: number): Promise<UserStory> {
        return this.repository.get(id)
    }

    create(epicId: number, fakeId: string, nombre: string, rol: string, descripcion: string, criterios: string, dod: string, prioridad: string, puntos: number, dependencias: string, resumen: string): Promise<UserStory> {
        return this.repository.create(epicId, fakeId, nombre, rol, descripcion, criterios, dod, prioridad, puntos, dependencias, resumen)
    }

    update(id: number, nombre: string, rol: string, descripcion: string, criterios: string, dod: string, prioridad: string, puntos: number, dependencias: string, resumen: string): Promise<UserStory> {
        return this.repository.update(id, nombre, rol, descripcion, criterios, dod, prioridad, puntos, dependencias, resumen)
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id)
    }
}
