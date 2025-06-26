import { useContext } from 'react'
import { NotificationContext } from './NotificationContext'

export const useNotification = (): (message: string, type?: 'success' | 'error' | 'info') => void => {
    const ctx = useContext(NotificationContext)
    if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
    return ctx.notify
}