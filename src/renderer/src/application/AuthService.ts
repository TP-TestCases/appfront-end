import { User } from '@renderer/domain/user'

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

export class AuthService {
    constructor(private baseUrl = 'http://localhost:8000') { }

    async login(payload: LoginPayload): Promise<User | null> {
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
            id: 0,
            username: data.username,
            password: '',
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