import { Epic } from "../domain/Epic"
import { EpicRepository } from "../domain/EpicRepository"
import { InMemoryEpicRepository } from "../infrastructure/InMemoryEpicRepository"

export class EpicService {
    constructor(private repository: EpicRepository = new InMemoryEpicRepository()) { }

    listByUser(userId: number): Promise<Epic[]> {
        return this.repository.listByUser(userId)
    }

    list(proyecto_id: number): Promise<Epic[]> {
        return this.repository.list(proyecto_id)
    }

    create(fake_id: string, nombre: string, descripcion: string, proyecto_id: number): Promise<Epic> {
        return this.repository.create(fake_id, nombre, descripcion, proyecto_id)
    }

    update(id: number, nombre: string, descripcion: string): Promise<Epic> {
        return this.repository.update(id, nombre, descripcion)
    }

    delete(id: number): Promise<void> {
        return this.repository.delete(id)
    }
}