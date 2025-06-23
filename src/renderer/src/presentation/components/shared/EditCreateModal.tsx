import React from 'react'
import { Icon } from '@iconify/react'
import FormField from './FormField'
import { Buttons } from './Button'

interface Field {
    name: string
    label: string
    value: string
    onChange: (value: string) => void
    required?: boolean
    type?: 'text' | 'select' | 'date' | 'number' | 'password'
    options?: { label: string; value: string }[]
    placeholder?: string
}

interface EditCreateModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    title: string
    fields: Field[]
    saveLabel?: string
    cancelLabel?: string
}

const EditCreateModal: React.FC<EditCreateModalProps> = ({
    isOpen,
    onClose,
    onSave,
    title,
    fields,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
}) => {
    if (!isOpen) return null

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-none w-screen h-screen z-40"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg overflow-hidden">

                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Close modal"
                        >
                            <Icon icon="mdi:close" className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="px-6 py-4 space-y-4">
                        {fields.map((field) =>
                            field.type === 'select' && field.options ? (
                                <div key={field.name}>
                                    <label
                                        htmlFor={field.name}
                                        className="block text-xs font-medium text-gray-600 mb-1"
                                    >
                                        {field.label}
                                    </label>
                                    <select
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        required={field.required}
                                        className="w-full bg-gray-50 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="" disabled>
                                            {field.placeholder ?? `Select ${field.label}`}
                                        </option>
                                        {field.options.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <FormField
                                    key={field.name}
                                    id={field.name}
                                    label={field.label}
                                    type={field.type === 'password' ? 'password' : field.type ?? 'text'}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                />
                            )
                        )}
                    </div>

                    <div className="flex justify-end px-6 py-4 border-t border-gray-200 space-x-3">
                        <Buttons
                            type="button"
                            tone="danger"
                            flat
                            fullWidth={false}
                            onClick={onClose}
                        >
                            {cancelLabel}
                        </Buttons>
                        <Buttons
                            type="button"
                            tone="primary"
                            flat
                            fullWidth={false}
                            onClick={onSave}
                        >
                            {saveLabel}
                        </Buttons>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditCreateModal