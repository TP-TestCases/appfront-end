import React from 'react'
import { Button, ButtonProps } from '@nextui-org/react'

export interface AppButtonProps extends Omit<ButtonProps, 'color'> {
    type?: 'button' | 'submit' | 'reset'
    flat?: boolean
    tone?: 'primary' | 'danger' | 'default'
    rounded?: 'md' | 'xl'
    fullWidth?: boolean
    className?: string
    children: React.ReactNode
}

const TONE_CLASSES: Record<string, string> = {
    primary: 'bg-blue-500 hover:bg-blue-400 text-white',
    danger: 'bg-red-500  hover:bg-red-400  text-white',
    default: 'bg-gray-300 hover:bg-gray-200 text-gray-700'
}

export const Buttons: React.FC<AppButtonProps> = ({
    type = 'button',
    flat = true,
    tone = 'primary',
    rounded = 'xl',
    fullWidth = true,
    onPress,
    onClick,
    className = '',
    children,
    ...rest
}) => {
    const radius = rounded === 'xl' ? 'rounded-xl' : 'rounded-md'
    const full = fullWidth ? 'w-full' : ''
    const toneCls = flat ? TONE_CLASSES[tone] : ''
    return (
        <Button
            {...rest}
            type={type}
            variant={flat ? 'flat' : rest.variant}
            color={flat ? undefined : tone}
            onPress={onPress}
            onClick={onClick}
            className={`${full} py-2 font-medium ${radius} ${toneCls} ${className}`}
        >
            {children}
        </Button>
    )
}
