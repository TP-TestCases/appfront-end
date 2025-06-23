import React from 'react'

interface FormFieldProps {
    id: string
    label: string
    type?: React.HTMLInputTypeAttribute
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    required?: boolean
}

const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false
}) => (
    <div className="bg-gray-100 rounded-md px-3 py-2">
        <label htmlFor={id} className="block text-xs font-medium text-gray-500">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="mt-1 w-full bg-transparent text-sm placeholder-gray-500 focus:outline-none"
        />
    </div>
)

export default FormField
