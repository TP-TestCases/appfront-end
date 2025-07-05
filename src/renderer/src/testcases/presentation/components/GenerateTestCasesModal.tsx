import React from 'react'
import { Icon } from '@iconify/react'
import { Buttons } from '../../../shared/components/Button'
import { useNotification } from '../../../shared/utils/useNotification'

interface GenerateTestCasesModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (userStoryId: number, promptExtra: string, dbFile: File) => Promise<void>
  loading?: boolean
  userStories: { id: number; fake_id: string }[]
  userStoryLoading: boolean
}

const GenerateTestCasesModal: React.FC<GenerateTestCasesModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  loading = false,
  userStories,
  userStoryLoading
}) => {
  const notify = useNotification()
  const [userStoryId, setUserStoryId] = React.useState('')
  const [promptExtra, setPromptExtra] = React.useState('')
  const [dbFile, setDbFile] = React.useState<File | null>(null)
  const [error, setError] = React.useState('')

  // Limpiar campos cuando se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      setUserStoryId('')
      setPromptExtra('')
      setDbFile(null)
      setError('')
    }
  }, [isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validar que sea un archivo .db
      if (!selectedFile.name.endsWith('.db')) {
        setError('El archivo debe ser una base de datos (.db)')
        setDbFile(null)
        return
      }
      setDbFile(selectedFile)
      setError('')
    }
  }

  const handleGenerate = async (): Promise<void> => {
    setError('')

    if (!userStoryId.trim()) {
      setError('Debe seleccionar una historia de usuario')
      return
    }

    if (!dbFile) {
      setError('Debe seleccionar un archivo de base de datos')
      return
    }

    try {
      await onGenerate(Number(userStoryId), promptExtra, dbFile)
      handleClose()
      notify('Test cases generados correctamente', 'success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar test cases')
    }
  }

  const handleClose = (): void => {
    setUserStoryId('')
    setPromptExtra('')
    setDbFile(null)
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
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:test-tube" className="text-green-500 h-5 w-5" />
              <h3 className="text-lg font-semibold text-gray-800">
                Generar Test Cases con IA
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

            {/* Select de Historia de Usuario */}
            <div>
              <label
                htmlFor="userStorySelect"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Historia de Usuario *
              </label>
              <select
                id="userStorySelect"
                value={userStoryId}
                onChange={(e) => setUserStoryId(e.target.value)}
                required
                disabled={userStoryLoading}
                className="w-full bg-gray-50 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="" disabled>
                  {userStoryLoading ? 'Cargando historias...' : 'Selecciona una historia de usuario'}
                </option>
                {userStories.map((story) => (
                  <option key={story.id} value={String(story.id)}>
                    {story.fake_id}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Extra */}
            <div>
              <label
                htmlFor="promptExtra"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Instrucciones Adicionales (Opcional)
              </label>
              <textarea
                id="promptExtra"
                value={promptExtra}
                onChange={(e) => setPromptExtra(e.target.value)}
                placeholder="Agrega instrucciones específicas para la IA..."
                rows={3}
                className="w-full bg-gray-50 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ejemplo: &quot;Enfocar en casos de error de validación&quot; o &quot;Incluir pruebas de rendimiento&quot;
              </p>
            </div>

            {/* Input de Archivo de Base de Datos */}
            <div>
              <label
                htmlFor="dbFile"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Base de Datos Congelada (.db) *
              </label>
              <input
                id="dbFile"
                type="file"
                accept=".db"
                onChange={handleFileChange}
                className="w-full bg-gray-50 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {dbFile && (
                <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                  <Icon icon="lucide:check" className="h-4 w-4" />
                  {dbFile.name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Sube un archivo .db con datos de prueba para generar test cases más realistas
              </p>
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
              onClick={handleGenerate}
              disabled={loading || userStoryLoading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin" />
                  Generando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:sparkles" className="h-4 w-4" />
                  Generar Test Cases
                </div>
              )}
            </Buttons>
          </div>
        </div>
      </div>
    </>
  )
}

export default GenerateTestCasesModal