import React from 'react'
import { Icon } from '@iconify/react'
import { Buttons } from '../../../shared/components/Button'
import GenerateTestCasesModal from './GenerateTestCasesModal'
import { TestCaseService } from '../../application/TestCaseService'
import { ApiTestCaseRepository } from '../../infrastructure/ApiTestCaseRepository'
import { ApiUserStoryRepository } from '../../../userstories/infrastructure/ApiUserStoryRepository'
import { UserStoryService } from '../../../userstories/application/UserStoryService'
import { useNotification } from '../../../shared/utils/useNotification'
import { useDisclosure } from '@nextui-org/react'
import { TestScenario } from '@renderer/testcases/domain/testScenario'
import { TestCase } from '@renderer/testcases/domain/testCases'

const getUserId = (): number | null => {
    const user = localStorage.getItem('user')
    if (!user) return null
    try {
        return JSON.parse(user).id
    } catch {
        return null
    }
}

const testCaseService = new TestCaseService(new ApiTestCaseRepository())
const userStoryService = new UserStoryService(new ApiUserStoryRepository())

const TestCases: React.FC = () => {
    const userId = getUserId()
    const notify = useNotification()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [scenarios, setScenarios] = React.useState<TestScenario[]>([])
    const [testCases, setTestCases] = React.useState<TestCase[]>([])
    const [userStories, setUserStories] = React.useState<{ id: number; fake_id: string }[]>([])
    const [userStoryLoading, setUserStoryLoading] = React.useState(false)
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [selectedUserStory, setSelectedUserStory] = React.useState<number | null>(null)
    const [loading, setLoading] = React.useState(false)

    const handleUserStorySelectOpen = React.useCallback(async (): Promise<void> => {
        if (!userId) return
        setUserStoryLoading(true)
        try {
            const stories = await userStoryService.listSimpleByUser(userId)
            setUserStories(stories)
        } catch (error) {
            console.error('Error loading user stories:', error)
            notify('Error al cargar historias de usuario', 'error')
        } finally {
            setUserStoryLoading(false)
        }
    }, [userId, notify])

    const handleGenerate = async (userStoryId: number, promptExtra: string, dbFile: File): Promise<void> => {
        setIsGenerating(true)
        try {
            const result = await testCaseService.generateTestCases(userStoryId, promptExtra, dbFile)
            notify(result.mensaje, 'success')

            if (selectedUserStory === userStoryId) {
                await loadTestCases(userStoryId)
            }
        } finally {
            setIsGenerating(false)
        }
    }

    const loadTestCases = async (userStoryId: number): Promise<void> => {
        setLoading(true)
        try {
            console.log(`Cargando test cases para User Story ID: ${userStoryId}`)

            const data = await testCaseService.getTestCasesByUserStory(userStoryId)

            console.log('Escenarios recibidos:', data.scenarios)
            console.log('Test cases recibidos:', data.testCases)

            setScenarios(data.scenarios || [])
            setTestCases(data.testCases || [])

            if (data.scenarios.length > 0) {
                notify(`Se cargaron ${data.scenarios.length} escenario(s) con ${data.testCases.length} test case(s)`, 'success')
            } else {
                notify('No se encontraron test cases para esta historia de usuario', 'info')
            }

        } catch (error) {
            console.error('Error loading test cases:', error)
            notify('Error al cargar test cases', 'error')
            setScenarios([])
            setTestCases([])
        } finally {
            setLoading(false)
        }
    }

    const handleUserStoryChange = (userStoryId: number): void => {
        setSelectedUserStory(userStoryId)
        loadTestCases(userStoryId)
    }

    React.useEffect(() => {
        if (userId) {
            handleUserStorySelectOpen()
        }
    }, [userId, handleUserStorySelectOpen])

    const getTestCasesByScenario = (scenarioId: number): TestCase[] => {
        if (!testCases || !Array.isArray(testCases)) return []
        return testCases.filter(tc => tc.test_scenario_id === scenarioId)
    }

    const getTypeIcon = (tipo: string): { icon: string; color: string } => {
        switch (tipo) {
            case 'happy': return { icon: 'lucide:check-circle', color: 'text-green-500' }
            case 'error': return { icon: 'lucide:x-circle', color: 'text-red-500' }
            case 'alternative': return { icon: 'lucide:alert-circle', color: 'text-yellow-500' }
            default: return { icon: 'lucide:circle', color: 'text-gray-500' }
        }
    }

    const getTypeLabel = (tipo: string): string => {
        switch (tipo) {
            case 'happy': return 'Happy Path'
            case 'error': return 'Error Path'
            case 'alternative': return 'Alternative Path'
            default: return tipo
        }
    }

    const handleOpenGenerateModal = (): void => {
        // Verificar que userStories existe y tiene elementos
        if (!userStories || userStories.length === 0) {
            if (userId) {
                handleUserStorySelectOpen().then(() => {
                    onOpen()
                })
            }
        } else {
            onOpen()
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon icon="lucide:test-tube" className="h-6 w-6 text-green-500" />
                    <h1 className="text-2xl font-bold text-gray-800">Test Cases</h1>
                </div>
                <Buttons
                    type="button"
                    tone="primary"
                    flat
                    fullWidth={false}
                    onClick={handleOpenGenerateModal}
                >
                    <Icon icon="lucide:sparkles" className="h-4 w-4 mr-2" />
                    Generar con IA
                </Buttons>
            </div>

            {/* Selector de Historia de Usuario */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                        Historia de Usuario:
                    </label>
                    <select
                        value={selectedUserStory || ''}
                        onChange={(e) => e.target.value && handleUserStoryChange(Number(e.target.value))}
                        disabled={userStoryLoading}
                        className="bg-gray-50 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                        <option value="" disabled>
                            {userStoryLoading ? 'Cargando...' : 'Selecciona una historia de usuario'}
                        </option>
                        {userStories && userStories.map((story) => (
                            <option key={story.id} value={story.id}>
                                {story.fake_id}
                            </option>
                        ))}
                    </select>
                    {loading && (
                        <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin text-green-500" />
                    )}
                </div>
            </div>

            {/* Test Cases Content */}
            {selectedUserStory && (
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <Icon icon="lucide:loader-2" className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
                            <p className="text-gray-600">Cargando test cases...</p>
                        </div>
                    ) : scenarios.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                            <Icon icon="lucide:test-tube" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No hay test cases generados
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Usa la IA para generar test cases automáticamente basados en tu historia de usuario.
                            </p>
                            <Buttons
                                type="button"
                                tone="primary"
                                flat
                                fullWidth={false}
                                onClick={handleOpenGenerateModal}
                            >
                                <Icon icon="lucide:sparkles" className="h-4 w-4 mr-2" />
                                Generar Test Cases
                            </Buttons>
                        </div>
                    ) : (
                        scenarios.map((scenario) => (
                            <div key={scenario.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Escenario de Prueba
                                    </h3>
                                    <p className="text-gray-600 mt-1">{scenario.descripcion}</p>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {getTestCasesByScenario(scenario.id!).map((testCase) => {
                                            const typeInfo = getTypeIcon(testCase.type)
                                            return (
                                                <div key={testCase.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Icon icon={typeInfo.icon} className={`h-5 w-5 ${typeInfo.color}`} />
                                                        <span className="font-medium text-gray-800">{testCase.fake_id}</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${testCase.type === 'happy' ? 'bg-green-100 text-green-800' :
                                                                testCase.type === 'error' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {getTypeLabel(testCase.type)}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div>
                                                            <h4 className="font-medium text-gray-700 mb-1">Datos de Entrada</h4>
                                                            <p className="text-gray-600">{testCase.input_data}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-700 mb-1">Pasos</h4>
                                                            <p className="text-gray-600">{testCase.steps}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-700 mb-1">Resultado Esperado</h4>
                                                            <p className="text-gray-600">{testCase.expected_result}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <GenerateTestCasesModal
                isOpen={isOpen}
                onClose={onClose}
                onGenerate={handleGenerate}
                loading={isGenerating}
                userStories={userStories || []}
                userStoryLoading={userStoryLoading}
            />
        </div>
    )
}

export default TestCases