import { DashboardStats } from '../domain/dashboard'

export interface DashboardRepository {
    load(): Promise<DashboardStats>
}