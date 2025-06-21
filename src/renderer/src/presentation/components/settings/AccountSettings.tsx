import React from 'react'
import { Card, CardHeader, CardBody, Button, Select, SelectItem } from '@nextui-org/react'
import { InMemorySettingsRepository } from '@renderer/infrastructure/settings/InMemorySettingsRepository'
import { SettingsService } from '@renderer/application/settings/SettingsService'
import { Settings } from '@renderer/domain/settings/settings'


const repository = new InMemorySettingsRepository({ language: 'English', notifications: 'Enabled' })
const settingsService = new SettingsService(repository)

const AccountSettings: React.FC = () => {
  const [language, setLanguage] = React.useState('English')
  const [notifications, setNotifications] = React.useState('Enabled')

  React.useEffect(() => {
    settingsService.getSettings().then((s) => {
      setLanguage(s.language)
      setNotifications(s.notifications)
    })
  }, [])

  const handleSave = async (): Promise<void> => {
    const data: Settings = { language, notifications }
    await settingsService.saveSettings(data)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </CardHeader>
        <CardBody className="space-y-6">
          <Select
            label="Language"
            placeholder="Select language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <SelectItem key="English">English</SelectItem>
            <SelectItem key="Spanish">Spanish</SelectItem>
          </Select>
          <Select
            label="Notifications"
            placeholder="Select notification preference"
            value={notifications}
            onChange={(e) => setNotifications(e.target.value)}
          >
            <SelectItem key="Enabled">Enabled</SelectItem>
            <SelectItem key="Disabled">Disabled</SelectItem>
          </Select>
          <Button color="primary" onPress={handleSave}>
            Save Changes
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}

export default AccountSettings
