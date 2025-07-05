export interface TestCase {
  id?: number
  fake_id: string
  type: 'happy' | 'error' | 'alternative'
  input_data: string
  steps: string
  expected_result: string
  actual_result: string
  status: string
  test_scenario_id: number
}