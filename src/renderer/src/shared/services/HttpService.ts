export class HttpService {
    private static instance: HttpService
    private accessToken: string | null = null

    constructor(private baseUrl: string = import.meta.env.VITE_API_URL) {
        this.accessToken = localStorage.getItem('access_token')

        if (this.baseUrl.startsWith('http://')) {
            this.baseUrl = this.baseUrl.replace('http://', 'https://')
        }
        if (this.baseUrl.endsWith('/')) {
            this.baseUrl = this.baseUrl.slice(0, -1)
        }

        console.log('HttpService initialized with baseUrl:', this.baseUrl)
    }

    static getInstance(): HttpService {
        if (!HttpService.instance) {
            HttpService.instance = new HttpService()
        }
        return HttpService.instance
    }

    setToken(token: string): void {
        this.accessToken = token
        localStorage.setItem('access_token', token)
    }

    clearToken(): void {
        this.accessToken = null
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
    }

    private getAuthHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        }

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`
        }

        return headers
    }

    async get(endpoint: string): Promise<Response> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        })

        if (response.status === 401) {
            this.clearToken()
            throw new Error('Unauthorized - Please login again')
        }

        return response
    }

    async post(endpoint: string, body?: unknown): Promise<Response> {
        const url = `${this.baseUrl}${endpoint}`
        console.log('POST URL:', url)
        console.log('Headers:', this.getAuthHeaders())
        console.log('Body:', body)

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: body ? JSON.stringify(body) : undefined
            })

            console.log('Response status:', response.status)
            console.log('Response headers:', response.headers)

            if (response.status === 401) {
                this.clearToken()
                throw new Error('Unauthorized - Please login again')
            }

            return response
        } catch (error) {
            console.error('Fetch error:', error)
            throw error
        }
    }

    async put(endpoint: string, body?: unknown): Promise<Response> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: body ? JSON.stringify(body) : undefined
        })

        if (response.status === 401) {
            this.clearToken()
            throw new Error('Unauthorized - Please login again')
        }

        return response
    }

    async delete(endpoint: string): Promise<Response> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        })

        if (response.status === 401) {
            this.clearToken()
            throw new Error('Unauthorized - Please login again')
        }

        return response
    }

    async postFormData(endpoint: string, formData: FormData): Promise<Response> {
        const url = `${this.baseUrl}${endpoint}`
        const headers: Record<string, string> = {}

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`
        }

        console.log('postFormData URL:', url)
        console.log('postFormData headers:', headers)
        console.log('FormData entries:')
        for (const [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value)
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData
            })

            console.log('postFormData response status:', response.status)
            console.log('postFormData response headers:', response.headers)

            if (response.status === 401) {
                this.clearToken()
                throw new Error('Unauthorized - Please login again')
            }

            return response
        } catch (error) {
            console.error('postFormData fetch error:', error)
            throw error
        }
    }

    async testConnection(): Promise<void> {
        try {
            console.log('Testing connection to:', this.baseUrl)
            const response = await fetch(`${this.baseUrl}/`, {
                method: 'OPTIONS',
                headers: {
                    'Origin': window.location.origin
                }
            })
            console.log('OPTIONS response:', response.status, response.statusText)
            console.log('CORS headers:', response.headers.get('Access-Control-Allow-Origin'))
        } catch (error) {
            console.error('Connection test failed:', error)
        }
    }

    isAuthenticated(): boolean {
        return this.accessToken !== null
    }
}
