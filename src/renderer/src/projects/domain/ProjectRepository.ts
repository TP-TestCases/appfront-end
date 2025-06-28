import { Project } from "./Project"

export interface ProjectRepository {
    list(usuarioId: number): Promise<Project[]>
    listShort(usuarioId: number): Promise<{ id: number; nombre: string }[]>
    create(usuarioId: number, nombre: string, descripcion: string): Promise<Project>
    update(id: number, nombre: string, descripcion: string): Promise<Project>
    delete(id: number): Promise<void>
}
