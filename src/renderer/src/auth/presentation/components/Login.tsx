import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../../shared/components/FormField'
import { Buttons } from '../../../shared/components/Button'
import { AuthService } from '@renderer/auth/application/AuthService'
import { useNotification } from '@renderer/shared/utils/useNotification'

const authService = new AuthService()

const Login: React.FC<{ setIsLoggedIn: (value: boolean) => void }> = ({
  setIsLoggedIn,
}) => {
  const [form, setForm] = React.useState({ name: '', password: '' })
  const navigate = useNavigate()
  const notify = useNotification()

  const inputs = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      value: form.name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, name: e.target.value }),
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
    try {
      const user = await authService.login({
        name: form.name,
        password: form.password
      })
      setIsLoggedIn(true)
      localStorage.setItem('user', JSON.stringify(user))
      notify('¡Login exitoso!', 'success')
      navigate('/')
    } catch (e: unknown) {
      if (e instanceof Error) {
        notify(e.message, 'error')
      } else {
        notify('Ocurrió un error desconocido', 'error')
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