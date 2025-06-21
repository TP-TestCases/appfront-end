import React from 'react'
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '@renderer/application/AuthService'

const authService = new AuthService()
const Register: React.FC = () => {
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const navigate = useNavigate()

  const handleRegister = async (): Promise<void> => {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      await authService.register({
        firstName,
        lastName,
        password,
        confirmPassword
      })
      navigate('/')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const showFirstNameHint = firstName.length === 0
  const showLastNameHint = lastName.length === 0
  const showPasswordHint = password.length === 0
  const showConfirmPasswordHint = confirmPassword.length === 0

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-small text-default-500">Create your account</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            type="text"
            label={showFirstNameHint ? 'First Name' : undefined}
            description={showFirstNameHint ? 'Enter your first name' : undefined}
            placeholder={!showFirstNameHint ? 'Enter your first name' : undefined}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
          />

          <Input
            type="text"
            label={showLastNameHint ? 'Last Name' : undefined}
            description={showLastNameHint ? 'Enter your last name' : undefined}
            placeholder={!showLastNameHint ? 'Enter your last name' : undefined}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
          />

          <Input
            type="password"
            label={showPasswordHint ? 'Password' : undefined}
            description={showPasswordHint ? 'Create a password' : undefined}
            placeholder={!showPasswordHint ? 'Create a password' : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          <Input
            type="password"
            label={showConfirmPasswordHint ? 'Confirm Password' : undefined}
            description={showConfirmPasswordHint ? 'Re-enter your password' : undefined}
            placeholder={!showConfirmPasswordHint ? 'Re-enter your password' : undefined}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />

          {error && <p className="text-danger text-small">{error}</p>}

          <Button
            className="bg-red-100 hover:bg-red-200 rounded-xl"
            fullWidth
            onPress={handleRegister}
          >
            Register
          </Button>

          <p className="text-center text-small">
            Already have an account?{' '}
            <Link to="/" className="text-primary hover:underline hover:text-blue-600">
              Login
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

export default Register
