import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button, Listbox, ListboxItem } from '@nextui-org/react'
import { Icon } from '@iconify/react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'lucide:home' },
  { to: '/chat', label: 'Chat', icon: 'lucide:message-circle' },
  { to: '/projects', label: 'Projects', icon: 'lucide:folder-kanban' },
  { to: '/epics', label: 'Epics', icon: 'lucide:git-branch-plus' },
  { to: '/user-stories', label: 'User Stories', icon: 'lucide:combine' },
  { to: '/settings', label: 'Settings', icon: 'lucide:settings' },
]

const Sidebar: React.FC = () => {
  const { pathname } = useLocation()

  const liClass = (path: string): string =>
    `rounded-xl ${pathname === path
      ? 'bg-blue-500 text-white hover:bg-blue-400'
      : 'hover:bg-blue-200 hover:text-gray-600'
    }`

  return (
    <aside className="w-64 bg-content1 h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <Icon icon="lucide:layout-dashboard" className="text-blue-500 text-2xl mr-2" />
        <h1 className="text-xl font-bold">Story Chat</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map(({ to, label, icon }) => (
            <li key={to} className={liClass(to)}>
              <Button
                as={Link}
                to={to}
                variant={pathname === to ? 'solid' : 'light'}
                color={pathname === to ? 'primary' : 'default'}
                startContent={<Icon icon={icon} />}
                className="w-full justify-start"
              >
                {label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8">
        <Listbox aria-label="User actions">
          <ListboxItem
            key="logout"
            startContent={<Icon icon="lucide:log-out" />}
            className="text-danger cursor-pointer"
            onClick={() => {
              localStorage.removeItem('user')
              window.location.href = '/'
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
