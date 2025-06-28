import { User } from "../domain/user"

export interface RegisterPayload {
    nombre: string
    contraseña: string
}

export interface LoginPayload {
    nombre: string
    contraseña: string
}

const API_URL = import.meta.env.VITE_API_URL

export class AuthService {
    constructor(private baseUrl = API_URL) { }

    async login(payload: LoginPayload): Promise<User> {
        const response = await fetch(`${this.baseUrl}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: payload.nombre,
                contraseña: payload.contraseña
            })
        })

        if (!response.ok) {
            const data = await response.json().catch(() => null)
            throw new Error(data?.detail ?? 'Login failed')
        }

        const data = await response.json()
        return {
            id: data.id,
            nombre: data.nombre
        }
    }

    async register(payload: RegisterPayload): Promise<void> {
        const response = await fetch(`${this.baseUrl}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: payload.nombre,
                contraseña: payload.contraseña
            })
        })

        if (!response.ok) {
            const data = await response.json().catch(() => null)
            throw new Error(data?.detail ?? 'Registration failed')
        }
    }
}