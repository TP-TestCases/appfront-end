import { createContext } from 'react'

export type NotificationType = 'success' | 'error' | 'info'

export interface NotificationContextProps {
    notify: (message: string, type?: NotificationType) => void
}

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined)