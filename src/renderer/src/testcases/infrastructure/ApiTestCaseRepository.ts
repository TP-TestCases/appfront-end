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

        const response = await fetch(`${this.baseUrl}/generar-testcases/`, {
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
        const response = await fetch(`${this.baseUrl}/test-scenarios/user-story/${userStoryId}`)
        if (!response.ok) {
            throw new Error('Error al cargar test cases')
        }
        return await response.json()
    }
}