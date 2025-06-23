import { DashboardStats } from "../domain/dashboard";
import { DashboardRepository } from "../infrastructure/DashboardRepository";

export class DashboardService {
    constructor(private repository: DashboardRepository) { }

    async getStats(): Promise<DashboardStats> {
        return this.repository.load()
    }
}