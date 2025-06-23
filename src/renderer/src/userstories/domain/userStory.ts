export type StoryStatus = 'To Do' | 'In Progress' | 'Done'

export interface UserStory {
    id: number
      title: string
    epic: string
    status: StoryStatus
}