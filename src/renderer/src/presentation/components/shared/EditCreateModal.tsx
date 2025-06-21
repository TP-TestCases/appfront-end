import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'

interface Field {
    name: string
    label: string
    value: string
    onChange: (value: string) => void
    required?: boolean
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
                            {fields.map((field) => (
                                <Input
                                    key={field.name}
                                    label={field.label}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    fullWidth
                                    required={field.required}
                                />
                            ))}
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
