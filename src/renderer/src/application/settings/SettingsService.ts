import { Settings } from "@renderer/domain/settings/settings"
import { SettingsRepository } from "@renderer/infrastructure/settings/SettingsRepository"

export class SettingsService {
    constructor(private repository: SettingsRepository) { }

    async getSettings(): Promise<Settings> {
        return this.repository.load()
    }

    async saveSettings(settings: Settings): Promise<void> {
        await this.repository.save(settings)
    }
}