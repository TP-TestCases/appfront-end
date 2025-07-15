import { User } from "../domain/user"
import { HttpService } from "../../shared/services/HttpService"

export interface RegisterPayload {
    name: string
    password: string
}

export interface LoginPayload {
    name: string
    password: string
}

export interface LoginResponse {
    access_token: string
    token_type: string
    user: User
}

export class AuthService {
    private httpService: HttpService

    constructor() {
        this.httpService = HttpService.getInstance()
    }

    async login(payload: LoginPayload): Promise<LoginResponse> {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
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

        const data: LoginResponse = await response.json()

        // Almacenar el token en el HttpService
        this.httpService.setToken(data.access_token)

        return data
    }

    async register(payload: RegisterPayload): Promise<void> {
        const response = await this.httpService.post('/users', {
            name: payload.name,
            password: payload.password
        })

        if (!response.ok) {
            const data = await response.json().catch(() => null)
            throw new Error(data?.detail ?? 'Registration failed')
        }
    }

    logout(): void {
        this.httpService.clearToken()
        localStorage.removeItem('user')
    }

    isAuthenticated(): boolean {
        return this.httpService.isAuthenticated()
    }
}