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
import ConfirmModal from '@renderer/shared/components/ConfirmModalProps'

interface Project {
    id: number
    name: string
    description: string
    status_project: boolean
}

const service = new ProjectService(new ApiProjectRepository())
const USER_ID = 1

const Projects: React.FC = () => {
    const [projects, setProjects] = React.useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = React.useState<Project[]>([])
    const [searchQuery, setSearchQuery] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingProject, setEditingProject] = React.useState<Project | null>(null)
    const [form, setForm] = React.useState({ name: '', description: '', status_project: true })

    React.useEffect(() => {
        service.list(USER_ID).then((data) => {
            setProjects(data)
            setFilteredProjects(data)
        })
    }, [])

    React.useEffect(() => {
        setFilteredProjects(
            projects.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }, [searchQuery, projects])

    const handleSearch = (query: string): void => {
        setSearchQuery(query)
    }

    const handleEdit = (project: Project): void => {
        setEditingProject(project)
        setForm({ name: project.name, description: project.description, status_project: project.status_project })
        onOpen()
    }

    const handleCreate = (): void => {
        setEditingProject(null)
        setForm({ name: '', description: '', status_project: true })
        onOpen()
    }

    const handleSave = async (): Promise<void> => {
        if (!form.name.trim()) return
        if (editingProject) {
            try {
                const updated = await service.update(editingProject.id, form.name, form.description, true)
                setProjects((prev) => prev.map((p) => (p.id === updated.id ? { ...updated, description: form.description } : p)))
            } catch (e) {
                console.error(e)
            }
        } else {
            try {
                const created = await service.create(USER_ID, form.name, form.description, true)
                setProjects((prev) => [...prev, { ...created, description: form.description }])
            } catch (e) {
                console.error(e)
            }
        }
        onClose()
    }

    const [showConfirm, setShowConfirm] = React.useState(false)
    const [deleteId, setDeleteId] = React.useState<number | null>(null)


    const handleDelete = async (id: number): Promise<void> => {
        try {
            await service.delete(id)
            setProjects((prev) => prev.filter((p) => p.id !== id))
            setFilteredProjects((prev) => prev.filter((p) => p.id !== id))
        } catch (e) {
            console.error(e)
        }
    }

    const handleConfirmDelete = async (): Promise<void> => {
        if (deleteId !== null) {
            await handleDelete(deleteId)
            setShowConfirm(false)
            setDeleteId(null)
        }
    }

    const fields = [
        {
            name: 'name',
            label: 'Name',
            value: form.name,
            onChange: (value: string) => setForm((f) => ({ ...f, name: value })),
            required: true
        },
        {
            name: 'description',
            label: 'Description',
            value: form.description,
            onChange: (value: string) => setForm((f) => ({ ...f, description: value })),
            required: true
        },
        {
            name: 'status_project',
            label: 'Activo',
            type: "select" as const,
            value: form.status_project ? '1' : '0',
            onChange: (value: string) => setForm((f) => ({ ...f, status_project: value === '1' })),
            options: [
                { label: 'Activo', value: '1' },
                { label: 'Inactivo', value: '0' }
            ],
            required: true
        }
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
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>{project.description}</TableCell>
                            <TableCell>
                                <span
                                    className={` px-3 py-1 rounded-2xl font-semibold text-sm
                                        ${project.status_project
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-600'}
                                            w-24`}
                                    style={{ display: 'inline-block' }}
                                >
                                    {project.status_project ? 'Activo' : 'Inactivo'}
                                </span>
                            </TableCell>
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
                                    <Button
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        onPress={() => {
                                            setDeleteId(project.id)
                                            setShowConfirm(true)
                                        }}
                                        aria-label="Eliminar"
                                    >
                                        <Icon icon="lucide:trash" />
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
            <ConfirmModal
                isOpen={showConfirm}
                title="Desactivar proyecto"
                description="¿Estás seguro de que deseas desactivar este proyecto? Podrás volver a activarlo la edición."
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    )
}

export default Projects
