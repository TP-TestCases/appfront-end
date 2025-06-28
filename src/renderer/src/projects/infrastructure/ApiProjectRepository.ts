import { Project } from '../domain/Project'
import { ProjectRepository } from '../domain/ProjectRepository'

const API_URL = import.meta.env.VITE_API_URL

export class ApiProjectRepository implements ProjectRepository {
    constructor(private baseUrl: string = API_URL) { }

    private mapProject(data: {
        id: number
        nombre: string
        descripcion: string
        usuario_id: number
    }): Project {
        return {
            id: data.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            usuario_id: data.usuario_id
        }
    }

    async list(usuarioId: number): Promise<Project[]> {
        const response = await fetch(`${this.baseUrl}/proyectos/usuario/${usuarioId}`)
        if (!response.ok) {
            throw new Error('Failed to load projects')
        }
        const data = await response.json()
        return data.map((p: { id: number; nombre: string; descripcion: string; usuario_id: number }) =>
            this.mapProject(p)
        )
    }

    async listShort(usuarioId: number): Promise<{ id: number; nombre: string }[]> {
        const response = await fetch(`${this.baseUrl}/proyectos/usuario/${usuarioId}`)
        if (!response.ok) {
            throw new Error('Failed to load short projects')
        }
        const data = await response.json()
        return data.map((p: { id: number; nombre: string }) => ({ id: p.id, nombre: p.nombre }))
    }

    async create(usuarioId: number, nombre: string, descripcion: string): Promise<Project> {
        const response = await fetch(`${this.baseUrl}/proyectos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioId, nombre, descripcion })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to create project')
        }
        const data = await response.json()
        return this.mapProject(data)
    }

    async update(id: number, nombre: string, descripcion: string): Promise<Project> {
        const response = await fetch(`${this.baseUrl}/proyectos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion })
        })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to update project')
        }
        const data = await response.json()
        return this.mapProject(data)
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/proyectos/${id}`, { method: 'DELETE' })
        if (!response.ok) {
            const err = await response.json().catch(() => null)
            throw new Error(err?.detail ?? 'Failed to delete project')
        }
    }
}