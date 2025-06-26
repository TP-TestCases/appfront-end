import React from 'react'
import { NextUIProvider } from '@nextui-org/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Sidebar from './shared/components/Sidebar';
import Dashboard from './dashboard/presentation/components/Dashboard';
import Login from './auth/presentation/components/Login';
import Register from './auth/presentation/components/Register';
import Projects from './projects/presentation/components/Projects';
import UserStories from './userstories/presentation/components/UserStories';
import Chat from './chat/presentation/components/Chat';
import AccountSettings from './settings/presentation/components/AccountSettings';
import Epics from './epics/presentation/components/Epics';
import { NotificationProvider } from './shared/components/Notification' // <-- Importa el provider

const AppRoutes: React.FC<{ isLoggedIn: boolean; setIsLoggedIn: (v: boolean) => void }> = ({
  isLoggedIn,
  setIsLoggedIn
}) => {
  const isAuthPage = window.location.pathname === '/' && !isLoggedIn || window.location.pathname === '/register'

  if (isAuthPage) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-grow overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/user-stories" element={<UserStories />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/epics" element={<Epics />} />
        </Routes>
      </main>
    </div>
  )
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  return (
    <NextUIProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </Router>
      </NotificationProvider>
    </NextUIProvider>
  )
}

export default App