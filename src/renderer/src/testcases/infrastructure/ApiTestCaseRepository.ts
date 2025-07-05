import { TestCaseRepository } from '../domain/TestCaseRepository'
import { TestCase } from '../domain/testCases';
import { TestScenario } from '../domain/testScenario';

const API_URL = import.meta.env.VITE_API_URL

export class ApiTestCaseRepository implements TestCaseRepository {
    constructor(private baseUrl: string = API_URL) { }

    async generateTestCases(
        userStoryId: number,
        promptExtra: string,
        dbFile: File
    ): Promise<{ mensaje: string; us_id: number; estado: string }> {
        const formData = new FormData()
        formData.append('user_story_id', String(userStoryId))
        formData.append('prompt_extra', promptExtra)
        formData.append('archivo_db', dbFile)

        const response = await fetch(`${this.baseUrl}/generate_test_cases/`, {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            const error = await response.json().catch(() => null)
            throw new Error(error?.detail ?? 'Error al generar test cases')
        }

        return await response.json()
    }

    async listByUserStory(userStoryId: number): Promise<{
        scenarios: TestScenario[]
        testCases: TestCase[]
    }> {
        const scenariosResponse = await fetch(`${this.baseUrl}/test_scenarios/by-user-story/${userStoryId}`)
        if (!scenariosResponse.ok) {
            throw new Error('Error al cargar escenarios de test')
        }
        const scenarios: TestScenario[] = await scenariosResponse.json()

        const allTestCases: TestCase[] = []

        for (const scenario of scenarios) {
            if (scenario.id) {
                try {
                    const testCases = await this.listByScenario(scenario.id)
                    allTestCases.push(...testCases)
                } catch (error) {
                    console.error(`Error loading test cases for scenario ${scenario.id}:`, error)
                }
            }
        }

        return {
            scenarios,
            testCases: allTestCases
        }
    }

    async listByScenario(testScenarioId: number): Promise<TestCase[]> {
        const response = await fetch(`${this.baseUrl}/test_cases/by-scenario/${testScenarioId}`)
        if (!response.ok) {
            throw new Error('Error al cargar test cases del escenario')
        }
        const data: Partial<TestCase>[] = await response.json()
        return data.map((tc) => ({
            id: tc.id!,
            fake_id: tc.fake_id ?? '',
            type: tc.type ?? 'happy',
            input_data: tc.input_data ?? '',
            steps: tc.steps ?? '',
            expected_result: tc.expected_result ?? '',
            actual_result: tc.actual_result ?? '',
            status: tc.status ?? '',
            test_scenario_id: testScenarioId
        }))
    }
}