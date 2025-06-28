import { TestCase } from "./testCases"
import { TestScenario } from "./testScenario"

export interface TestCaseRepository {
    generateTestCases(userStoryId: number, promptExtra: string, dbFile: File): Promise<{
        mensaje: string
        us_id: number
        estado: string
    }>

    listByUserStory(userStoryId: number): Promise<{
        scenarios: TestScenario[]
        testCases: TestCase[]
    }>
}