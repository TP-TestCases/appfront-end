import React from 'react'
import { NextUIProvider } from '@nextui-org/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import UserStories from './presentation/components/UserStories'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import Register from './components/Register'
import AccountSettings from './components/AccountSettings'

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
