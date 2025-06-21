import { DashboardStats } from "@renderer/domain/dashboard/dashboard";

export interface DashboardRepository {
    load(): Promise<DashboardStats>
}