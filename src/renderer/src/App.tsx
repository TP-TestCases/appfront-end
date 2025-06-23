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

const AppRoutes: React.FC<{ isLoggedIn: boolean; setIsLoggedIn: (v: boolean) => void }> = ({
  isLoggedIn,
  setIsLoggedIn
}) => {
  const shouldPad = isLoggedIn

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {isLoggedIn && (
        <aside className="w-64 bg-content1 h-screen p-4 flex flex-col fixed left-0 top-0 bottom-0 z-40">
          <Sidebar />
        </aside>
      )}
      <main
        className={`
          flex-grow
          ${shouldPad ? 'p-8' : ''}
          ${isLoggedIn ? 'ml-64 h-screen overflow-y-auto' : ''}
          ${!isLoggedIn ? 'h-screen flex items-center justify-center overflow-hidden' : ''}
        `}
      >
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
      <Router>
        <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </Router>
    </NextUIProvider>
  )
}

export default App