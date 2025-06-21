import { DashboardStats } from '../../domain/dashboard/dashboard'
import { DashboardRepository } from './DashboardRepository'

export class InMemoryDashboardRepository implements DashboardRepository {
    private stats: DashboardStats

    constructor(initialStats: DashboardStats) {
        this.stats = initialStats
    }

    async load(): Promise<DashboardStats> {
        return this.stats
    }
}