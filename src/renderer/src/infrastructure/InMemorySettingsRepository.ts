import { Settings } from '../domain/settings'
import { SettingsRepository } from './SettingsRepository'

export class InMemorySettingsRepository implements SettingsRepository {
    private settings: Settings

    constructor(initialSettings: Settings) {
        this.settings = initialSettings
    }

    async load(): Promise<Settings> {
        return this.settings
    }

    async save(settings: Settings): Promise<void> {
        this.settings = settings
    }
}