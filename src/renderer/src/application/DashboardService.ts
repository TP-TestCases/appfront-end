import { DashboardStats } from "@renderer/domain/dashboard";
import { DashboardRepository } from "@renderer/infrastructure/DashboardRepository";

export class DashboardService {
    constructor(private repository: DashboardRepository) { }

    async getStats(): Promise<DashboardStats> {
        return this.repository.load()
    }
}