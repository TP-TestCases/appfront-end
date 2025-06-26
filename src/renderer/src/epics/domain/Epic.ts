export interface Epic {
    id: number
    project_id: number
    second_id: string
    name: string
    description: string
    status_epic: boolean
    createdAt: string
    updatedAt?: string | null
}