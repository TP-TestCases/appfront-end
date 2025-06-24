export interface Project {
    id: number
    name: string
    description: string
    status_project: boolean
    userId: number
    createdAt: string
    updatedAt?: string | null
}
