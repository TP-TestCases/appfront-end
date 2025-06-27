export interface UserStory {
  id: number
  epic_id: number
  second_id: string
  name: string
  rol: string
  description: string
  acceptance_criteria: string
  dod: string
  priority: string
  story_points: number
  dependencies: string
  summary: string
  status_user_stories: boolean
  createdAt: string
  updatedAt?: string | null
}