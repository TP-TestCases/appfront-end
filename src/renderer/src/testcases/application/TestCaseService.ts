import { TestCaseRepository } from '../domain/TestCaseRepository'
import { TestCase } from '../domain/testCases';
import { TestScenario } from '../domain/testScenario';

export class TestCaseService {
    constructor(private repository: TestCaseRepository) { }

    async generateTestCases(
        userStoryId: number,
        promptExtra: string,
        dbFile: File
    ): Promise<{ mensaje: string; us_id: number; estado: string }> {
        return this.repository.generateTestCases(userStoryId, promptExtra, dbFile)
    }

    async getTestCasesByUserStory(userStoryId: number): Promise<{
        scenarios: TestScenario[]
        testCases: TestCase[]
    }> {
        return this.repository.listByUserStory(userStoryId)
    }
}