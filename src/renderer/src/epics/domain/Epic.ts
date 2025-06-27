export interface Epic {
    id: number
    user_id?: number | null
    project_id: number
    project_name: string
    second_id: string
    name: string
    description: string
    status_epic: boolean
    createdAt: string
    updatedAt?: string | null
}