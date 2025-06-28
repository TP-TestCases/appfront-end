import React from 'react'
import { Icon } from '@iconify/react'
import { Buttons } from '../../../shared/components/Button'

interface ImportModalProps {
    isOpen: boolean
    onClose: () => void
    onImport: (projectId: number, file: File) => void
    loading?: boolean
    projectOptions: { id: number; name: string }[]
    projectLoading: boolean
    onProjectSelectOpen: () => Promise<void>
}

const ImportModal: React.FC<ImportModalProps> = ({
    isOpen,
    onClose,
    onImport,
    loading = false,
    projectOptions,
    projectLoading,
}) => {
    const [projectId, setProjectId] = React.useState('')
    const [file, setFile] = React.useState<File | null>(null)
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        if (isOpen) {
            setProjectId('')
            setFile(null)
            setError('')
        }
    }, [isOpen])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setError('')
        }
    }

    const handleImport = (): void => {
        setError('')

        if (!projectId.trim()) {
            setError('Debe seleccionar un proyecto')
            return
        }

        const id = Number(projectId)
        if (Number.isNaN(id) || id <= 0) {
            setError('Proyecto inválido')
            return
        }

        if (!file) {
            setError('Debe seleccionar un archivo')
            return
        }

        onImport(id, file)
    }

    const handleClose = (): void => {
        setProjectId('')
        setFile(null)
        setError('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-none w-screen h-screen z-40"
                onClick={handleClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:upload" className="text-blue-500 h-5 w-5" />
                            <h3 className="text-lg font-semibold text-gray-800">
                                Importar Historias de Usuario
                            </h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Close modal"
                        >
                            <Icon icon="mdi:close" className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-4 space-y-4">

                        {/* Select de Proyecto */}
                        <div>
                            <label
                                htmlFor="projectSelect"
                                className="block text-xs font-medium text-gray-600 mb-1"
                            >
                                Proyecto *
                            </label>
                            <select
                                id="projectSelect"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                required
                                disabled={projectLoading}
                                className="w-full bg-gray-50 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                <option value="" disabled>
                                    {projectLoading ? 'Cargando proyectos...' : 'Selecciona un proyecto'}
                                </option>
                                {projectOptions.map((project) => (
                                    <option key={project.id} value={String(project.id)}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Input de Archivo */}
                        <div>
                            <label
                                htmlFor="file"
                                className="block text-xs font-medium text-gray-600 mb-1"
                            >
                                Archivo Excel (.xlsx) *
                            </label>
                            <input
                                id="file"
                                type="file"
                                accept=".xlsx"
                                onChange={handleFileChange}
                                className="w-full bg-gray-50 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            {file && (
                                <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                                    <Icon icon="lucide:check" className="h-4 w-4" />
                                    {file.name}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600 flex items-center gap-2">
                                    <Icon icon="lucide:alert-circle" className="h-4 w-4" />
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end px-6 py-4 border-t border-gray-200 space-x-3">
                        <Buttons
                            type="button"
                            tone="danger"
                            flat
                            fullWidth={false}
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Buttons>
                        <Buttons
                            type="button"
                            tone="primary"
                            flat
                            fullWidth={false}
                            onClick={handleImport}
                            disabled={loading || projectLoading}
                        >
                            {loading ? 'Importando...' : 'Importar'}
                        </Buttons>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ImportModal