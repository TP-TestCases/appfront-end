import { User } from "../domain/user"

export interface RegisterPayload {
    firstName: string
    lastName: string
    password: string
    confirmPassword: string
}

export interface LoginPayload {
    username: string
    password: string
}

const API_URL = import.meta.env.VITE_API_URL

export class AuthService {
    constructor(private baseUrl = API_URL) { }

    async login(payload: LoginPayload): Promise<User> {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: payload.username,
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
            username: data.username,
            firstName: data.first_name,
            lastName: data.last_name
        }
    }

    async register(payload: RegisterPayload): Promise<void> {
        const response = await fetch(`${this.baseUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: payload.firstName,
                last_name: payload.lastName,
                password: payload.password,
                confirm_password: payload.confirmPassword
            })
        })

        if (!response.ok) {
            const data = await response.json().catch(() => null)
            throw new Error(data?.detail ?? 'Registration failed')
        }
    }
}