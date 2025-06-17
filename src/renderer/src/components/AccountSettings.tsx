import React from 'react'
import { Card, CardHeader, CardBody, Button, Select, SelectItem } from '@nextui-org/react'

const AccountSettings: React.FC = () => {
  const [language, setLanguage] = React.useState('English')
  const [notifications, setNotifications] = React.useState('Enabled')

  const handleSave = (): void => {
    // Implement save logic here
    console.log('Settings saved:', { language, notifications })
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
