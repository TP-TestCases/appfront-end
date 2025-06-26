import React, { useState, useCallback } from 'react'
import { NotificationContext, NotificationType } from '../utils/NotificationContext'


interface Notification {
    message: string
    type?: NotificationType
}


export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification | null>(null)
    const [visible, setVisible] = useState(false)

    const notify = useCallback((message: string, type: NotificationType = 'info') => {
        setNotification({ message, type })
        setVisible(true)
        setTimeout(() => setVisible(false), 3000)
    }, [])

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            {notification && visible && (
                <div className={`
            fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-lg text-white text-base font-medium transition-all duration-300
            ${notification.type === 'success' ? 'bg-green-500' : ''}
            ${notification.type === 'error' ? 'bg-red-500' : ''}
            ${notification.type === 'info' ? 'bg-blue-500' : ''}
            `}>
                    {notification.message}
                </div>
            )}
        </NotificationContext.Provider>
    )
}