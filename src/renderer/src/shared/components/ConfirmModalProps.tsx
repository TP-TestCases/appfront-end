import React from 'react'
import { Icon } from '@iconify/react'
import { Buttons } from './Button'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    description?: string
    onConfirm: () => void
    onCancel: () => void
    confirmLabel?: string
    cancelLabel?: string
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    confirmLabel = 'Sí',
    cancelLabel = 'No',
}) => {
    if (!isOpen) return null

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-none w-screen h-screen z-40"
                onClick={onCancel}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Cerrar"
                        >
                            <Icon icon="mdi:close" className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="px-6 py-6">
                        {description && (
                            <p className="text-gray-700 text-sm mb-4">{description}</p>
                        )}
                        <div className="flex justify-end gap-3">
                            <Buttons
                                type="button"
                                tone="danger"
                                flat
                                fullWidth={false}
                                onClick={onCancel}
                            >
                                {cancelLabel}
                            </Buttons>
                            <Buttons
                                type="button"
                                tone="primary"
                                flat
                                fullWidth={false}
                                onClick={onConfirm}
                            >
                                {confirmLabel}
                            </Buttons>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmModal