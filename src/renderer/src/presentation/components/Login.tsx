import React from 'react'
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '@renderer/application/AuthService'
import { InMemoryUserRepository } from '@renderer/infrastructure/InMemoryUserRepository'

const repository = new InMemoryUserRepository([
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User'
  }
])
const authService = new AuthService(repository)

const Login: React.FC<{ setIsLoggedIn: (value: boolean) => void }> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const navigate = useNavigate()

  const handleLogin = async (): Promise<void> => {
    const user = await authService.login(username, password)

    if (user) {
      setIsLoggedIn(true)
      navigate('/')
    } else {
      setError('Invalid credentials')
    }
  }

  const showUsernameHint = username.length === 0
  const showPasswordHint = password.length === 0

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-small text-default-500">Enter your credentials to continue</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            type="text"
            label={showUsernameHint ? 'Username' : undefined}
            description={showUsernameHint ? 'Enter your username' : undefined}
            placeholder={!showUsernameHint ? 'Enter your username' : undefined}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <Input
            type="password"
            label={showPasswordHint ? 'Password' : undefined}
            description={showPasswordHint ? 'Enter your password' : undefined}
            placeholder={!showPasswordHint ? 'Enter your password' : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          {error && <p className="text-danger text-small ">{error}</p>}
          <Button
            className="bg-red-100 hover:bg-red-200 rounded-xl"
            fullWidth
            onPress={handleLogin}
          >
            Login
          </Button>
          <p className="text-center text-small">
            Don&apos;t have an account?
            <Link to="/register" className="text-primary hover:underline hover:text-blue-600">
              Register
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

export default Login
