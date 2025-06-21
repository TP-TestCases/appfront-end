import { DashboardStats } from "@renderer/domain/dashboard/dashboard";
import { DashboardRepository } from "@renderer/infrastructure/dashboard/DashboardRepository";

export class DashboardService {
    constructor(private repository: DashboardRepository) { }

    async getStats(): Promise<DashboardStats> {
        return this.repository.load()
    }
}