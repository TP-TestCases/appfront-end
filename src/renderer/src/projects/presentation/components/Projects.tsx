import React from 'react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    useDisclosure
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import EditCreateModal from '../../../shared/components/EditCreateModal'
import { ProjectService } from '@renderer/projects/application/ProjectService'
import { ApiProjectRepository } from '@renderer/projects/infrastructure/ApiProjectRepository'
import { useNotification } from '@renderer/shared/utils/useNotification'

interface Project {
    id: number
    nombre: string
    descripcion: string
}

const service = new ProjectService(new ApiProjectRepository())

const getUserId = (): number | null => {
    const user = localStorage.getItem('user')
    if (!user) return null
    try {
        return JSON.parse(user).id
    } catch {
        return null
    }
}

const Projects: React.FC = () => {
    const userId = getUserId()
    const [projects, setProjects] = React.useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = React.useState<Project[]>([])
    const [searchQuery, setSearchQuery] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingProject, setEditingProject] = React.useState<Project | null>(null)
    const [form, setForm] = React.useState({ nombre: '', descripcion: '' })
    const notify = useNotification()

    React.useEffect(() => {
        if (userId) {
            service.list(userId).then((data) => {
                setProjects(data)
                setFilteredProjects(data)
            })
        }
    }, [userId])

    React.useEffect(() => {
        setFilteredProjects(
            projects.filter(
                (p) =>
                    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.descripcion ?? '').toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }, [searchQuery, projects])

    const handleSearch = (query: string): void => {
        setSearchQuery(query)
    }

    const handleEdit = (project: Project): void => {
        setEditingProject(project)
        setForm({ nombre: project.nombre, descripcion: project.descripcion })
        onOpen()
    }

    const handleCreate = (): void => {
        setEditingProject(null)
        setForm({ nombre: '', descripcion: '' })
        onOpen()
    }

    const handleSave = async (): Promise<void> => {
        if (!form.nombre.trim() || !userId) return
        if (editingProject) {
            try {
                const updated = await service.update(editingProject.id, form.nombre, form.descripcion)
                setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                notify('Proyecto actualizado correctamente', 'success')
            } catch (e) {
                console.error(e)
                notify('Error al actualizar el proyecto', 'error')
            }
        } else {
            try {
                const created = await service.create(userId, form.nombre, form.descripcion)
                setProjects((prev) => [...prev, created])
                notify('Proyecto creado correctamente', 'success')
            } catch (e) {
                console.error(e)
                notify('Error al crear el proyecto', 'error')
            }
        }
        onClose()
    }

    const fields = [
        {
            name: 'nombre',
            label: 'Nombre',
            value: form.nombre,
            onChange: (value: string) => setForm((f) => ({ ...f, nombre: value })),
            required: true
        },
        {
            name: 'descripcion',
            label: 'Descripción',
            value: form.descripcion,
            onChange: (value: string) => setForm((f) => ({ ...f, descripcion: value })),
            required: true
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Projects</h1>
                <Button color="primary" onPress={handleCreate}>
                    <Icon icon="lucide:plus" className="mr-2" />
                    Create Project
                </Button>
            </div>
            <Input
                placeholder="Search projects..."
                value={searchQuery}
                onValueChange={handleSearch}
                startContent={<Icon icon="lucide:search" />}
                className="max-w-xs"
            />
            <Table aria-label="Projects table" removeWrapper>
                <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>DESCRIPCIÓN</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell>{project.nombre}</TableCell>
                            <TableCell>{project.descripcion}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="light"
                                        color="primary"
                                        onPress={() => handleEdit(project)}
                                        aria-label="Editar"
                                    >
                                        <Icon icon="lucide:edit" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <EditCreateModal
                isOpen={isOpen}
                onClose={onClose}
                onSave={handleSave}
                title={editingProject ? 'Edit Project' : 'Create Project'}
                fields={fields}
            />
        </div>
    )
}

export default Projects
