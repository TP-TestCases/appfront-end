import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../../shared/components/FormField'
import { Buttons } from '../../../shared/components/Button'
import { AuthService } from '@renderer/auth/application/AuthService'
import { useNotification } from '@renderer/shared/utils/useNotification'

const authService = new AuthService()
const Register: React.FC = () => {
  const [form, setForm] = React.useState({
    nombre: '',
    contraseña: '',
    confirmarContraseña: ''
  })
  const navigate = useNavigate()
  const notify = useNotification()

  const inputs = [
    {
      id: 'nombre',
      label: 'Nombre',
      value: form.nombre,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, nombre: e.target.value }),
      placeholder: 'Ingresa tu nombre',
      required: true,
    },
    {
      id: 'contraseña',
      label: 'Contraseña',
      type: 'password',
      value: form.contraseña,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, contraseña: e.target.value }),
      placeholder: 'Ingresa tu contraseña',
      required: true,
    },
    {
      id: 'confirmarContraseña',
      label: 'Confirmar Contraseña',
      type: 'password',
      value: form.confirmarContraseña,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, confirmarContraseña: e.target.value }),
      placeholder: 'Re-ingresa tu contraseña',
      required: true,
    },
  ]

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (form.contraseña !== form.confirmarContraseña) {
      notify('Las contraseñas no coinciden', 'error')
      return
    }
    try {
      await authService.register({
        nombre: form.nombre,
        contraseña: form.contraseña,
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