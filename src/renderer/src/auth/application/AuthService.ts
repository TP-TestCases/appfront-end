import { User } from "../domain/user"

export interface RegisterPayload {
    name: string
    password: string
}

export interface LoginPayload {
    name: string
    password: string
}

const API_URL = import.meta.env.VITE_API_URL

export class AuthService {
    constructor(private baseUrl = API_URL) { }

    async login(payload: LoginPayload): Promise<User> {
        const response = await fetch(`${this.baseUrl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: payload.name,
                password: payload.password
            })
        })

        if (!response.ok) {
            const data = await response.json().catch(() => null)
            throw new Error(data?.detail ?? 'Login failed')
        }

        const data = await response.json()
        return {
            id: data.id,
            name: data.name
        }
    }

    async register(payload: RegisterPayload): Promise<void> {
        const response = await fetch(`${this.baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: payload.name,
                password: payload.password
            })
        })

        if (!response.ok) {
            const data = await response.json().catch(() => null)
            throw new Error(data?.detail ?? 'Registration failed')
        }
    }
}