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

const Epics: React.FC = () => {
    const [epics, setEpics] = React.useState<Epic[]>([])
    const [filteredEpics, setFilteredEpics] = React.useState<Epic[]>([])
    const [searchQuery, setSearchQuery] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingEpic, setEditingEpic] = React.useState<Epic | null>(null)
    const [form, setForm] = React.useState({ proyecto_id: '', fake_id: '', nombre: '', descripcion: '' })
    const userId = getUserId()
    const [projectOptions, setProjectOptions] = React.useState<{ id: number; name: string }[]>([])
    const [projectLoading, setProjectLoading] = React.useState(false)
    const notify = useNotification()

    React.useEffect(() => {
        if (!userId) return
        epicService.listByUser(userId).then((data) => {
            setEpics(data)
            setFilteredEpics(data)
        }).catch(console.error)
    }, [userId])


    React.useEffect(() => {
        setFilteredEpics(
            epics.filter((e) =>
                e.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.fake_id.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }, [searchQuery, epics])

    const handleSearch = (query: string): void => {
        setSearchQuery(query)
    }

    const handleCreate = (): void => {
        setEditingEpic(null)
        setForm({ proyecto_id: '', fake_id: '', nombre: '', descripcion: '' })
        handleProjectSelectOpen()
        onOpen()
    }

    const handleEdit = (epic: Epic): void => {
        setEditingEpic(epic)
        setForm({
            proyecto_id: '',
            fake_id: epic.fake_id,
            nombre: epic.nombre,
            descripcion: epic.descripcion
        })
        onOpen()
    }

    const handleSave = async (): Promise<void> => {
        if (!form.fake_id.trim() || !form.nombre.trim() || !form.proyecto_id) return
        if (editingEpic) {
            try {
                const updated = await epicService.update(
                    editingEpic.id,
                    form.nombre,
                    form.descripcion
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
                    form.fake_id,
                    form.nombre,
                    form.descripcion,
                    Number(form.proyecto_id)
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
            setProjectOptions(projects.map((p: { id: number; nombre: string }) => ({
                id: p.id,
                name: p.nombre
            })))
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
        ...(!editingEpic
            ? [{
                name: 'proyecto_id',
                label: 'Proyecto',
                type: 'select' as const,
                value: form.proyecto_id,
                onChange: (value: string) => setForm((f) => ({ ...f, proyecto_id: value })),
                options: projectOptions.map((p) => ({
                    label: p.name,
                    value: String(p.id)
                })),
                required: true,
                loading: projectLoading,
                placeholder: 'Selecciona un proyecto'
            }]
            : []
        ),
        {
            name: 'fake_id',
            label: 'Epic ID',
            value: form.fake_id,
            onChange: (value: string) => setForm((f) => ({ ...f, fake_id: value })),
            required: true
        },
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
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>DESCRIPCIÓN</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredEpics.map((epic) => (
                        <TableRow key={epic.id}>
                            <TableCell>{epic.fake_id}</TableCell>
                            <TableCell>{epic.nombre}</TableCell>
                            <TableCell>{epic.descripcion}</TableCell>
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