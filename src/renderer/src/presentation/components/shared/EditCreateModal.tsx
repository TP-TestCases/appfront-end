import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'

interface Field {
    name: string
    label: string
    value: string
    onChange: (value: string) => void
    required?: boolean
    type?: 'text' | 'select' | 'date' | 'number' | 'password'
    options?: { label: string; value: string }[] // para select
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
    cancelLabel = 'Cancel'
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg">
                {(onClose) => (
                    <>
                        <ModalHeader>{title}</ModalHeader>
                        <ModalBody>
                            {fields.map((field) => {
                                if (field.type === 'select' && field.options) {
                                    return (
                                        <select
                                            key={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required}
                                            className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white mb-2"
                                        >
                                            <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
                                            {field.options.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    )
                                }
                                if (field.type === 'date') {
                                    return (
                                        <Input
                                            key={field.name}
                                            type="date"
                                            label={field.label}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            fullWidth
                                            required={field.required}
                                            placeholder={field.placeholder}
                                        />
                                    )
                                }
                                return (
                                    <Input
                                        key={field.name}
                                        type={field.type || 'text'}
                                        label={field.label}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        fullWidth
                                        required={field.required}
                                        placeholder={field.placeholder}
                                    />
                                )
                            })}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                {cancelLabel}
                            </Button>
                            <Button color="primary" onPress={onSave}>
                                {saveLabel}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default EditCreateModal
