import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../../shared/components/FormField'
import { Buttons } from '../../../shared/components/Button'
import { AuthService } from '@renderer/auth/application/AuthService'
import { useNotification } from '@renderer/shared/utils/useNotification'

const authService = new AuthService()
const Register: React.FC = () => {
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()
  const notify = useNotification()

  const inputs = [
    {
      id: 'firstName',
      label: 'First Name',
      value: form.firstName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, firstName: e.target.value }),
      placeholder: 'Enter your first name',
      required: true,
    },
    {
      id: 'lastName',
      label: 'Last Name',
      value: form.lastName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, lastName: e.target.value }),
      placeholder: 'Enter your last name',
      required: true,
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      value: form.password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, password: e.target.value }),
      placeholder: 'Create a password',
      required: true,
    },
    {
      id: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      value: form.confirmPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, confirmPassword: e.target.value }),
      placeholder: 'Re-enter your password',
      required: true,
    },
  ]

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      notify('Passwords do not match', 'error')
      return
    }
    try {
      await authService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        confirmPassword: form.confirmPassword
      })
      notify('¡Registro exitoso!', 'success')
      navigate('/')
    } catch (error: unknown) {
      if (error instanceof Error) {
        notify(error.message || 'Error al registrar', 'error')
      } else {
        notify('Error al registrar', 'error')
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg px-6 py-8">
        <h1 className="text-center text-2xl font-bold mb-1">Register</h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Create your account
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          {inputs.map((props) => (
            <FormField key={props.id} {...props} />
          ))}

          <Buttons type="submit">
            Register
          </Buttons>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register