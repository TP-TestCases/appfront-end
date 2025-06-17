import React from 'react'
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react'
import { Link, useNavigate } from 'react-router-dom'

const Login: React.FC<{ setIsLoggedIn: (value: boolean) => void }> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const navigate = useNavigate()

  const handleLogin = (): void => {
    // Demo users
    const demoUsers = [
      { email: 'user@example.com', password: 'password123' },
      { email: 'admin@example.com', password: 'admin123' }
    ]

    const user = demoUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      setIsLoggedIn(true)
      navigate('/')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-small text-default-500">Enter your credentials to continue</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onValueChange={setEmail}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onValueChange={setPassword}
            placeholder="Enter your password"
          />
          {error && <p className="text-danger text-small">{error}</p>}
          <Button color="primary" fullWidth onPress={handleLogin}>
            Login
          </Button>
          <p className="text-center text-small">
            Don&apos;t have an account?
            <Link to="/register" className="text-primary">
              Register
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

export default Login
