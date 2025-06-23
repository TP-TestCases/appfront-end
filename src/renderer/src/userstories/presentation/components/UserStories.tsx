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
import { InMemoryUserStoryRepository } from '@renderer/userstories/infrastructure/InMemoryUserStoryRepository'
import { UserStoryService } from '@renderer/userstories/application/UserStoryService'
import { UserStory } from '@renderer/userstories/domain/userStory'

const repository = new InMemoryUserStoryRepository([
  {
    id: 1,
    title: 'Refine backlog ordering',
    epic: 'Epic 001',
    status: 'To Do'
  },
  {
    id: 2,
    title: 'Implement story import',
    epic: 'Epic 001',
    status: 'In Progress'
  },
  {
    id: 3,
    title: 'Validate acceptance criteria',
    epic: 'Epic 001',
    status: 'Done'
  }
])

const userStoryService = new UserStoryService(repository)

const UserStories: React.FC = () => {
  const [stories, setStories] = React.useState<UserStory[]>([])
  const [filteredStories, setFilteredStories] = React.useState<UserStory[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingStory, setEditingStory] = React.useState(null)
  const [form, setForm] = React.useState({ title: '', epic: '', status: '' })

  React.useEffect(() => {
    userStoryService.getStories().then((data) => {
      setStories(data)
      setFilteredStories(data)
    })
  }, [])

  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    setFilteredStories(
      stories.filter(
        (story) =>
          story.title.toLowerCase().includes(query.toLowerCase()) ||
          story.epic.toLowerCase().includes(query.toLowerCase()) ||
          story.status.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  const handleEdit = (story): void => {
    setEditingStory(story)
    setForm({ title: story.title, epic: story.epic, status: story.status })
    onOpen()
  }

  const handleCreate = (): void => {
    setEditingStory(null)
    setForm({ title: '', epic: '', status: '' })
    onOpen()
  }

  const handleSave = (updatedStory): void => {
    if (editingStory) {
      const updated = stories.map((s) => (s.id === updatedStory.id ? updatedStory : s))
      setStories(updated)
      setFilteredStories(updated)
      userStoryService.saveStories(updated)
    } else {
      const newStories = [...stories, { ...updatedStory, id: stories.length + 1 }]
      setStories(newStories)
      setFilteredStories(newStories)
      userStoryService.saveStories(newStories)
    }
    onClose()
  }

  const handleImport = (): void => {
    // Implement import functionality
  }

  const statusOptions = [
    { label: 'To Do', value: 'To Do' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Done', value: 'Done' }
  ]

  const fields = [
    {
      name: 'title',
      label: 'Title',
      value: form.title,
      onChange: (value: string) => setForm((f) => ({ ...f, title: value })),
      required: true
    },
    {
      name: 'epic',
      label: 'Epic',
      value: form.epic,
      onChange: (value: string) => setForm((f) => ({ ...f, epic: value })),
      required: true
    },
    {
      name: 'status',
      label: 'Status',
      value: form.status,
      onChange: (value: string) => setForm((f) => ({ ...f, status: value })),
      required: true,
      type: "select" as const,
      options: statusOptions,
      placeholder: 'Select status'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Stories</h1>
        <div className="space-x-2">
          <Button color="primary" onPress={handleCreate}>
            <Icon icon="lucide:plus" className="mr-2" />
            Create Story
          </Button>
          <Button color="secondary" onPress={handleImport}>
            <Icon icon="lucide:upload" className="mr-2" />
            Import
          </Button>
        </div>
      </div>
      <Input
        placeholder="Search stories..."
        value={searchQuery}
        onValueChange={handleSearch}
        startContent={<Icon icon="lucide:search" />}
        className="max-w-xs"
      />
      <Table aria-label="User stories table" removeWrapper>
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>EPIC</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredStories.map((story) => (
            <TableRow key={story.id}>
              <TableCell>{story.title}</TableCell>
              <TableCell>{story.epic}</TableCell>
              <TableCell>{story.status}</TableCell>
              <TableCell>
                <Button size="sm" variant="light" onPress={() => handleEdit(story)}>
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
        onSave={() => {
          if (editingStory) {
            handleSave({ ...editingStory as UserStory, ...form })
          } else {
            handleSave(form)
          }
        }}
        title={editingStory ? 'Edit Story' : 'Create Story'}
        fields={fields}
      />
    </div>
  )
}

export default UserStories
