import React from 'react'
import { NextUIProvider } from '@nextui-org/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './presentation/components/dashboard/Dashboard'
import UserStories from './presentation/components/userstories/UserStories'
import Chat from './presentation/components/chat/Chat'
import Sidebar from './presentation/components/shared/Sidebar'
import Login from './presentation/components/auth/Login'
import Register from './presentation/components/auth/Register'
import AccountSettings from './presentation/components/settings/AccountSettings'
import Projects from './presentation/components/projects/Projects'

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  return (
    <NextUIProvider>
      <Router>
        <div className="flex min-h-screen bg-background text-foreground">
          {isLoggedIn && <Sidebar />}
          <main className="flex-grow p-8">
            <Routes>
              <Route
                path="/"
                element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/user-stories" element={<UserStories />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/settings" element={<AccountSettings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </NextUIProvider>
  )
}

export default App
