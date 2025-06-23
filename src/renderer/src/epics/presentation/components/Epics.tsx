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
import { InMemoryEpicRepository } from '@renderer/epics/infrastructure/InMemoryEpicRepository'
import { EpicService } from '@renderer/epics/application/EpicService'

const initialEpics: Epic[] = [
    { second_id: 1, name: 'Epic Alpha', description: 'First epic', status: 'Active' },
    { second_id: 2, name: 'Epic Beta', description: 'Second epic', status: 'Inactive' }
]

const epicService = new EpicService(new InMemoryEpicRepository(initialEpics))

const Epics: React.FC = () => {
    const [epics, setEpics] = React.useState<Epic[]>(initialEpics)
    const [filteredEpics, setFilteredEpics] = React.useState<Epic[]>(initialEpics)
    const [searchQuery, setSearchQuery] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editingEpic, setEditingEpic] = React.useState<Epic | null>(null)
    const [form, setForm] = React.useState({ name: '', description: '', status: '' })

    React.useEffect(() => {
        setFilteredEpics(
            epics.filter((e) =>
                e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.status.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }, [searchQuery, epics])

    const handleSearch = (query: string): void => {
        setSearchQuery(query)
    }

    const handleEdit = (epic: Epic): void => {
        setEditingEpic(epic)
        setForm({ name: epic.name, description: epic.description, status: epic.status })
        onOpen()
    }

    const handleCreate = (): void => {
        setEditingEpic(null)
        setForm({ name: '', description: '', status: '' })
        onOpen()
    }

    const handleSave = (): void => {
        if (!form.name.trim()) return
        if (editingEpic) {
            const updated = epics.map((e) =>
                e.second_id === editingEpic.second_id ? { ...editingEpic, ...form } : e
            )
            setEpics(updated)
            setFilteredEpics(updated)
            epicService.saveEpic({ ...editingEpic, ...form })
        } else {
            const newEpic = {
                second_id: epics.length ? Math.max(...epics.map((e) => e.second_id)) + 1 : 1,
                ...form
            }
            const newEpics = [...epics, newEpic]
            setEpics(newEpics)
            setFilteredEpics(newEpics)
            epicService.saveEpic(newEpic)
        }
        onClose()
    }

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ]

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
            name: 'status',
            label: 'Status',
            value: form.status,
            onChange: (value: string) => setForm((f) => ({ ...f, status: value })),
            required: true,
            type: 'select' as const,
            options: statusOptions,
            placeholder: 'Select status'
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
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredEpics.map((epic) => (
                        <TableRow key={epic.second_id}>
                            <TableCell>{epic.name}</TableCell>
                            <TableCell>{epic.description}</TableCell>
                            <TableCell>{epic.status}</TableCell>
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