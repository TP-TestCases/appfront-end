import React from 'react'
import { Link } from 'react-router-dom'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from '@nextui-org/react'
import { Icon } from '@iconify/react'

const AppNavbar: React.FC = () => {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Icon icon="lucide:layout-dashboard" className="text-primary text-2xl mr-2" />
        <p className="font-bold text-inherit">Story Chat</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link to="/" className="text-foreground">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/user-stories" className="text-foreground">
            User Stories
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/chat" className="text-foreground">
            Chat
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name="Jane Doe"
              size="sm"
              src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">jane@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  )
}

export default AppNavbar
