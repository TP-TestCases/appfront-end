import { Epic } from './Epic'

export interface EpicRepository {
    listByUser(userId: number): Promise<Epic[]>
    list(proyecto_id: number): Promise<Epic[]>
    listShort(proyecto_id: number): Promise<{ id: number; fake_id: string; nombre: string }[]>
    create(fake_id: string, nombre: string, descripcion: string, proyecto_id: number): Promise<Epic>
    update(id: number, nombre: string, descripcion: string): Promise<Epic>
    delete(id: number): Promise<void>
}