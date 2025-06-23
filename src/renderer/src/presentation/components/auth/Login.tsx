import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '@renderer/application/auth/AuthService'
import FormField from '../shared/FormField'
import { Buttons } from '../shared/Button'

const authService = new AuthService()

const Login: React.FC<{ setIsLoggedIn: (value: boolean) => void }> = ({
  setIsLoggedIn,
}) => {
  const [form, setForm] = React.useState({ username: '', password: '' })
  const [error, setError] = React.useState('')
  const navigate = useNavigate()

  const inputs = [
    {
      id: 'username',
      label: 'Username',
      type: 'text',
      value: form.username,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, username: e.target.value }),
      placeholder: 'Enter your username',
      required: true,
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      value: form.password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, password: e.target.value }),
      placeholder: 'Enter your password',
      required: true,
    },
  ]

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')
    try {
      await authService.login({ username: form.username, password: form.password })
      setIsLoggedIn(true)
      navigate('/')
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg px-6 py-8">
        <h1 className="text-center text-2xl font-bold mb-1">Login</h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputs.map((props) => (
            <FormField key={props.id} {...props} />
          ))}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Buttons type="submit">
            Login
          </Buttons>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login