import { Settings } from "@renderer/domain/settings/settings"

export interface SettingsRepository {
    load(): Promise<Settings>
    save(settings: Settings): Promise<void>
}