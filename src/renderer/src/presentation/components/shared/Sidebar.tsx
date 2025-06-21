import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button, Listbox, ListboxItem } from '@nextui-org/react'
import { Icon } from '@iconify/react'

const Sidebar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string): boolean => location.pathname === path

  return (
    <aside className="w-64 bg-content1 h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <Icon icon="lucide:layout-dashboard" className="text-primary text-2xl mr-2" />
        <h1 className="text-xl font-bold">Story Chat</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Button
              as={Link}
              to="/"
              variant={isActive('/') ? 'solid' : 'light'}
              color={isActive('/') ? 'primary' : 'default'}
              startContent={<Icon icon="lucide:home" />}
              className="w-full justify-start"
            >
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              to="/projects"
              variant={isActive('/projects') ? 'solid' : 'light'}
              color={isActive('/projects') ? 'primary' : 'default'}
              startContent={<Icon icon="lucide:folder-kanban" />}
              className="w-full justify-start"
            >
              Projects
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              to="/user-stories"
              variant={isActive('/user-stories') ? 'solid' : 'light'}
              color={isActive('/user-stories') ? 'primary' : 'default'}
              startContent={<Icon icon="lucide:book-open" />}
              className="w-full justify-start"
            >
              User Stories
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              to="/chat"
              variant={isActive('/chat') ? 'solid' : 'light'}
              color={isActive('/chat') ? 'primary' : 'default'}
              startContent={<Icon icon="lucide:message-circle" />}
              className="w-full justify-start"
            >
              Chat
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              to="/settings"
              variant={isActive('/settings') ? 'solid' : 'light'}
              color={isActive('/settings') ? 'primary' : 'default'}
              startContent={<Icon icon="lucide:settings" />}
              className="w-full justify-start"
            >
              Settings
            </Button>
          </li>
        </ul>
      </nav>
      <div className="mt-8">
        <Listbox aria-label="User actions">
          <ListboxItem
            key="logout"
            startContent={<Icon icon="lucide:log-out" />}
            className="text-danger cursor-pointer"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Logout
          </ListboxItem>
        </Listbox>
      </div>
    </aside>
  )
}

export default Sidebar
