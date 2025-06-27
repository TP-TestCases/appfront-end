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
const PROJECT_ID = 1

const Epics: React.FC = () => {
    const [epics, setEpics] = React.useState<Epic[]>([])
    const [filteredEpics, setFilteredEpics] = React.useState<Epic[]>([])
    const [searchQuery, setSearchQuery] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingEpic, setEditingEpic] = React.useState<Epic | null>(null)
    const [form, setForm] = React.useState({ project_id: '', name: '', description: '', status_epic: true })
    const userId = getUserId()
    const [projectOptions, setProjectOptions] = React.useState<{ id: number; second_id: string; name: string }[]>([])
    const [projectLoading, setProjectLoading] = React.useState(false)
    const notify = useNotification()

    React.useEffect(() => {
        epicService.list(PROJECT_ID).then((data) => {
            setEpics(data)
            setFilteredEpics(data)
        }).catch(console.error)
    }, [])


    React.useEffect(() => {
        setFilteredEpics(
            epics.filter((e) =>
                e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }, [searchQuery, epics])

    const handleSearch = (query: string): void => {
        setSearchQuery(query)
    }

    const handleCreate = (): void => {
        setEditingEpic(null)
        setForm({ project_id: '', name: '', description: '', status_epic: true })
        onOpen()
    }

    const handleEdit = (epic: Epic): void => {
        setEditingEpic(epic)
        setForm({
            project_id: String(epic.project_id),
            name: epic.name,
            description: epic.description,
            status_epic: epic.status_epic
        })
        onOpen()
    }

    const handleSave = async (): Promise<void> => {
        if (!form.name.trim()) return
        if (editingEpic) {
            try {
                const updated = await epicService.update(
                    editingEpic.id,
                    form.name,
                    form.description,
                    form.status_epic
                )
                setEpics((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
                notify('Épica actualizada correctamente', 'success')
            } catch (e) {
                console.error(e)
                notify('Error al actualizar la épica', 'error')
            }
        } else {
            try {
                const created = await epicService.create(
                    PROJECT_ID,
                    form.name,
                    form.description,
                )
                setEpics((prev) => [...prev, created])
                notify('Épica creada correctamente', 'success')
            } catch (e) {
                console.error(e)
                notify('Error al crear la épica', 'error')
            }
        }
        onClose()
    }

    const handleProjectSelectOpen = async (): Promise<void> => {
        if (!userId) return
        setProjectLoading(true)
        try {
            console.log('Cargando proyectos para el usuario:', userId)
            const projects = await projectRepository.listShort(userId)
            setProjectOptions(projects)
            if (projects.length > 0) {
                notify(`Se cargaron ${projects.length} proyectos`, 'success')
            } else {
                notify('No hay proyectos disponibles para este usuario', 'info')
            }
        } catch {
            notify('Error al cargar proyectos', 'error')
        }
        setProjectLoading(false)
    }

    const fields = [
        {
            name: 'project_id',
            label: 'Proyecto',
            type: 'select' as const,
            value: form.project_id,
            onOpen: handleProjectSelectOpen,
            onChange: (value: string) => setForm((f) => ({ ...f, project_id: value })),
            options: projectOptions.map((p) => ({
                label: `${p.second_id} - ${p.name}`,
                value: String(p.id)
            })),
            required: true,
            loading: projectLoading,
            placeholder: 'Selecciona un proyecto'
        },
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
        ...(editingEpic
            ? [{
                name: 'status_epic',
                label: 'Activo',
                type: "select" as const,
                value: form.status_epic ? '1' : '0',
                onChange: (value: string) => setForm((f) => ({ ...f, status_epic: value === '1' })),
                options: [
                    { label: 'Activo', value: '1' },
                    { label: 'Inactivo', value: '0' }
                ],
                required: true
            }]
            : []
        )
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
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredEpics.map((epic) => (
                        <TableRow key={epic.id}>
                            <TableCell>{epic.name}</TableCell>
                            <TableCell>{epic.description}</TableCell>
                            <TableCell>
                                <span
                                    className={` px-3 py-1 rounded-2xl font-semibold text-sm
                                        ${epic.status_epic
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-600'}
                                            w-24`}
                                    style={{ display: 'inline-block' }}
                                >
                                    {epic.status_epic ? 'Activo' : 'Inactivo'}
                                </span>
                            </TableCell>
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
                onSave={handleSave}
                title={editingEpic ? 'Edit Epic' : 'Create Epic'}
                fields={fields}
            />
        </div>
    )
}

export default Epics