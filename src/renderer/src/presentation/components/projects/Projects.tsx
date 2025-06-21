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
import EditCreateModal from '../shared/EditCreateModal'

interface Project {
    id: number
    name: string
    description: string
}

const initialProjects: Project[] = [
    { id: 1, name: 'Project Alpha', description: 'First project description' },
    { id: 2, name: 'Project Beta', description: 'Second project description' }
]

const Projects: React.FC = () => {
    const [projects, setProjects] = React.useState<Project[]>(initialProjects)
    const [filteredProjects, setFilteredProjects] = React.useState<Project[]>(initialProjects)
    const [searchQuery, setSearchQuery] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingProject, setEditingProject] = React.useState<Project | null>(null)
    const [form, setForm] = React.useState({ name: '', description: '' })

    React.useEffect(() => {
        setFilteredProjects(
            projects.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
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

    const handleSave = (): void => {
        if (!form.name.trim()) return
        if (editingProject) {
            const updated = projects.map((p) =>
                p.id === editingProject.id ? { ...editingProject, ...form } : p
            )
            setProjects(updated)
        } else {
            const newProject = {
                id: projects.length ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
                ...form
            }
            setProjects([...projects, newProject])
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
