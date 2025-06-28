export interface TestCase {
  id?: number
  fake_id: string
  tipo: 'happy' | 'error' | 'alternative'
  datos_entrada: string
  pasos: string
  resultado_esperado: string
  resultado_real: string
  estado: string
  test_scenario_id: number
}