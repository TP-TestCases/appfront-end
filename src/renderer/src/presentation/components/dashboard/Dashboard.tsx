import React from 'react'
import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { DashboardService } from '@renderer/application/dashboard/DashboardService'
import { InMemoryDashboardRepository } from '@renderer/infrastructure/dashboard/InMemoryDashboardRepository'
import { Buttons } from '../shared/Button'

const repository = new InMemoryDashboardRepository({ totalStories: 15, inProgress: 5, completed: 8 })
const dashboardService = new DashboardService(repository)
const Dashboard: React.FC = () => {
  const [stats, setStats] = React.useState({ totalStories: 0, inProgress: 0, completed: 0 })

  React.useEffect(() => {
    dashboardService.getStats().then((s) => setStats(s))
  }, [])


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border border-gray-200 rounded-2xl">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Stories</h2>
            <div className="flex justify-end  py-4 border-t border-gray-200 space-x-3">
              <Buttons
                as={Link}
                to="/user-stories"
                tone="view"
              >
                View All
              </Buttons>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl font-bold">{stats.totalStories}</p>
                <p className="text-small text-default-500">Total Stories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
                <p className="text-small text-default-500">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                <p className="text-small text-default-500">Completed</p>
              </div>
            </div>
            <Buttons
              as={Link}
              to="/user-stories"
              tone="primary"
              fullWidth
            >
              <Icon icon="lucide:plus" className="mr-2" />
              Create New Story
            </Buttons>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
