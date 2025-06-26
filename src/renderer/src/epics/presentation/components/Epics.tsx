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

const PROJECT_ID = 1
const epicService = new EpicService(new ApiEpicRepository())

const Epics: React.FC = () => {
    const [epics, setEpics] = React.useState<Epic[]>([])
    const [filteredEpics, setFilteredEpics] = React.useState<Epic[]>([])
    const [searchQuery, setSearchQuery] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingEpic, setEditingEpic] = React.useState<Epic | null>(null)
    const [form, setForm] = React.useState({ name: '', description: '', status_epic: true })

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

    const handleEdit = (epic: Epic): void => {
        setEditingEpic(epic)
        setForm({ name: epic.name, description: epic.description, status_epic: epic.status_epic })
        onOpen()
    }

    const handleCreate = (): void => {
        setEditingEpic(null)
        setForm({ name: '', description: '', status_epic: true })
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
            } catch (e) {
                console.error(e)
            }
        } else {
            try {
                const created = await epicService.create(
                    PROJECT_ID,
                    form.name,
                    form.description
                )
                setEpics((prev) => [...prev, created])
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