import React from 'react'
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react'
import { Link, useNavigate } from 'react-router-dom'

const Register: React.FC = () => {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error] = React.useState('')
  const navigate = useNavigate()

  const handleRegister = (): void => {
    // Implement registration logic here
    navigate('/')
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-small text-default-500">Create your account</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input label="Name" value={name} onValueChange={setName} placeholder="Enter your name" />
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
            placeholder="Create a password"
          />
          {error && <p className="text-danger text-small">{error}</p>}
          <Button color="primary" fullWidth onPress={handleRegister}>
            Register
          </Button>
          <p className="text-center text-small">
            Already have an account?
            <Link to="/" className="text-primary">
              Login
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

export default Register
