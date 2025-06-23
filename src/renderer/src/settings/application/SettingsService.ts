import { Settings } from "../domain/settings"
import { SettingsRepository } from "../infrastructure/SettingsRepository"

export class SettingsService {
    constructor(private repository: SettingsRepository) { }

    async getSettings(): Promise<Settings> {
        return this.repository.load()
    }

    async saveSettings(settings: Settings): Promise<void> {
        await this.repository.save(settings)
    }
}