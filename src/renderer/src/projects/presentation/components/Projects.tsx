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

interface Project {
    id: number
    name: string
    description: string
}

const service = new ProjectService(new ApiProjectRepository())
const USER_ID = 1

const Projects: React.FC = () => {
    const [projects, setProjects] = React.useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = React.useState<Project[]>([])
    const [searchQuery, setSearchQuery] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingProject, setEditingProject] = React.useState<Project | null>(null)
    const [form, setForm] = React.useState({ name: '', description: '' })

    React.useEffect(() => {
        service.list(USER_ID).then((data) => {
            const items = data.map((d) => ({ ...d, description: '' }))
            setProjects(items)
            setFilteredProjects(items)
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
        setForm({ name: project.name, description: project.description })
        onOpen()
    }

    const handleCreate = (): void => {
        setEditingProject(null)
        setForm({ name: '', description: '' })
        onOpen()
    }

    const handleSave = async (): Promise<void> => {
        if (!form.name.trim()) return
        if (editingProject) {
            try {
                const updated = await service.update(editingProject.id, form.name, form.description)
                setProjects((prev) => prev.map((p) => (p.id === updated.id ? { ...updated, description: form.description } : p)))
            } catch (e) {
                console.error(e)
            }
        } else {
            try {
                const created = await service.create(USER_ID, form.name, form.description)
                setProjects((prev) => [...prev, { ...created, description: form.description }])
            } catch (e) {
                console.error(e)
            }
        }
        onClose()
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
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>{project.description}</TableCell>
                            <TableCell>
                                <Button size="sm" variant="light" onPress={() => handleEdit(project)}>
                                    <Icon icon="lucide:edit" />
                                </Button>
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
