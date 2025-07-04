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
    useDisclosure,
    Spinner
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import EditCreateModal from '../../../shared/components/EditCreateModal'
import { Epic } from '@renderer/epics/domain/Epic'
import { EpicService } from '@renderer/epics/application/EpicService'
import { ApiEpicRepository } from '@renderer/epics/infrastructure/ApiEpicRepository'
import { ApiProjectRepository } from '@renderer/projects/infrastructure/ApiProjectRepository'
import { useNotification } from '@renderer/shared/utils/useNotification'

const getUserId = (): number | null => {
    const user = localStorage.getItem('user')
    if (!user) return null
    try {
        return JSON.parse(user).id
    } catch {
        return null
    }
}

const epicService = new EpicService(new ApiEpicRepository())
const projectRepository = new ApiProjectRepository()

const Epics: React.FC = () => {
    const [epics, setEpics] = React.useState<Epic[]>([])
    const [filteredEpics, setFilteredEpics] = React.useState<Epic[]>([])
    const [searchQuery, setSearchQuery] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingEpic, setEditingEpic] = React.useState<Epic | null>(null)
    const [form, setForm] = React.useState({ project_id: '', fake_id: '', name: '', description: '' })
    const [saving, setSaving] = React.useState(false)
    const userId = getUserId()
    const [projectOptions, setProjectOptions] = React.useState<{ id: number; name: string }[]>([])
    const [projectLoading, setProjectLoading] = React.useState(false)
    const notify = useNotification()

    const loadEpics = React.useCallback(async () => {
        if (!userId) return
        try {
            const data = await epicService.listByUser(userId)
            setEpics(data)
            setFilteredEpics(data)
        } catch (error) {
            console.error('Error loading epics:', error)
            notify('Error al cargar épicas', 'error')
        }
    }, [userId, notify])

    React.useEffect(() => {
        loadEpics()
    }, [loadEpics])

    React.useEffect(() => {
        setFilteredEpics(
            epics.filter((e) =>
                e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.fake_id.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }, [searchQuery, epics])

    const handleSearch = (query: string): void => {
        setSearchQuery(query)
    }

    const handleCreate = (): void => {
        setEditingEpic(null)
        setForm({ project_id: '', fake_id: '', name: '', description: '' })
        handleProjectSelectOpen()
        onOpen()
    }

    const handleEdit = (epic: Epic): void => {
        setEditingEpic(epic)
        setForm({
            project_id: String(epic.project_id),
            fake_id: epic.fake_id,
            name: epic.name,
            description: epic.description
        })
        onOpen()
    }

    const handleSave = async (): Promise<void> => {
        if (!form.name.trim()) {
            notify('El nombre es requerido', 'error')
            return
        }
        if (!form.description.trim()) {
            notify('La descripción es requerida', 'error')
            return
        }
        if (!editingEpic && !form.fake_id.trim()) {
            notify('El ID de la épica es requerido', 'error')
            return
        }
        if (!editingEpic && !form.project_id) {
            notify('El proyecto es requerido', 'error')
            return
        }

        setSaving(true)

        try {
            if (editingEpic) {
                const updated = await epicService.update(
                    editingEpic.id,
                    form.name,
                    form.description
                )
                setEpics((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
                setFilteredEpics((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
                notify('Épica actualizada correctamente', 'success')
            } else {
                const created = await epicService.create(
                    form.fake_id,
                    form.name,
                    form.description,
                    Number(form.project_id)
                )
                setEpics((prev) => [...prev, created])
                setFilteredEpics((prev) => [...prev, created])
                notify('Épica creada correctamente', 'success')
            }
            onClose()
        } catch (error) {
            console.error('Error saving epic:', error)
            notify(`Error al ${editingEpic ? 'actualizar' : 'crear'} la épica: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleProjectSelectOpen = async (): Promise<void> => {
        if (!userId) return
        setProjectLoading(true)
        try {
            const projects = await projectRepository.listShort(userId)
            setProjectOptions(projects.map((p: { id: number; name: string }) => ({
                id: p.id,
                name: p.name
            })))
            if (projects.length > 0) {
                notify(`Se cargaron ${projects.length} proyectos`, 'success')
            } else {
                notify('No hay proyectos disponibles para este usuario', 'info')
            }
        } catch (error) {
            console.error('Error loading projects:', error)
            notify('Error al cargar proyectos', 'error')
        }
        setProjectLoading(false)
    }

    const handleModalSave = (): void => {
        if (!saving) {
            handleSave()
        }
    }

    const fields = [
        ...(!editingEpic
            ? [{
                name: 'project_id',
                label: 'Project',
                type: 'select' as const,
                value: form.project_id,
                onChange: (value: string) => setForm((f) => ({ ...f, project_id: value })),
                options: projectOptions.map((p) => ({
                    label: p.name,
                    value: String(p.id)
                })),
                required: true,
                onOpen: handleProjectSelectOpen,
                placeholder: projectLoading ? 'Loading projects...' : 'Select a project',
            }, {
                name: 'fake_id',
                label: 'Epic ID',
                value: form.fake_id,
                onChange: (value: string) => setForm((f) => ({ ...f, fake_id: value })),
                required: true,
            }]
            : []
        ),
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
            type: 'textarea' as const,
            value: form.description,
            onChange: (value: string) => setForm((f) => ({ ...f, description: value })),
            required: true
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Epics</h1>
                <Button color="primary" onPress={handleCreate}>
                    <Icon icon="lucide:plus" className="mr-2" />
                    Create Epic
                </Button>
            </div>
            <Input
                placeholder="Search epics..."
                value={searchQuery}
                onValueChange={handleSearch}
                startContent={<Icon icon="lucide:search" />}
                className="max-w-xs"
            />
            <Table aria-label="Epics table" removeWrapper>
                <TableHeader>
                    <TableColumn>EPIC ID</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredEpics.map((epic) => (
                        <TableRow key={epic.id}>
                            <TableCell>{epic.fake_id}</TableCell>
                            <TableCell>{epic.name}</TableCell>
                            <TableCell>{epic.description}</TableCell>
                            <TableCell>
                                <Button size="sm" variant="light" onPress={() => handleEdit(epic)}>
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
                onSave={handleModalSave}
                title={editingEpic ? 'Edit Epic' : 'Create Epic'}
                fields={fields}
                saveLabel={saving ? 'Saving...' : 'Save'}
                cancelLabel="Cancel"
            />
            {projectLoading && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg flex items-center gap-3">
                        <Spinner size="md" />
                        <span>Loading projects...</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Epics