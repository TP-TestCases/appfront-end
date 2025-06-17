import React from 'react'
import { Card, CardBody, CardHeader, Button, Avatar } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Stories</h2>
            <Link to="/user-stories">
              <Button color="primary" variant="flat" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-small text-default-500">Total Stories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-small text-default-500">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">8</p>
                <p className="text-small text-default-500">Completed</p>
              </div>
            </div>
            <Button as={Link} to="/user-stories" color="primary" fullWidth>
              <Icon icon="lucide:plus" className="mr-2" />
              Create New Story
            </Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Chat Activity</h2>
            <Link to="/chat">
              <Button color="primary" variant="flat" size="sm">
                Open Chat
              </Button>
            </Link>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Avatar size="sm" src="https://img.heroui.chat/image/avatar?w=200&h=200&u=2" />
                <div>
                  <p className="font-semibold">Alice</p>
                  <p className="text-small text-default-500">Hey, are you there?</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Avatar size="sm" src="https://img.heroui.chat/image/avatar?w=200&h=200&u=3" />
                <div>
                  <p className="font-semibold">Bob</p>
                  <p className="text-small text-default-500">
                    Don&apos;t forget our meeting at 3 PM.
                  </p>
                </div>
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
