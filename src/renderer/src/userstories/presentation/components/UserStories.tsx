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
import { UserStoryService } from '@renderer/userstories/application/UserStoryService'
import { UserStory } from '@renderer/userstories/domain/userStory'
import { ApiUserStoryRepository } from '@renderer/userstories/infrastructure/ApiUserStoryRepository'

const userStoryService = new UserStoryService(new ApiUserStoryRepository())
const EPIC_ID = 1

const UserStories: React.FC = () => {
  const [stories, setStories] = React.useState<UserStory[]>([])
  const [filteredStories, setFilteredStories] = React.useState<UserStory[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingStory, setEditingStory] = React.useState<UserStory | null>(null)
  const [form, setForm] = React.useState({
    name: '',
    rol: '',
    description: '',
    acceptance_criteria: '',
    dod: '',
    priority: '',
    story_points: 0,
    dependencies: '',
    summary: '',
    status_user_stories: true
  })

  React.useEffect(() => {
    userStoryService
      .list(EPIC_ID)
      .then((data) => {
        setStories(data)
        setFilteredStories(data)
      })
      .catch(console.error)
  }, [])

  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    setFilteredStories(
      stories.filter(
        (story) =>
          story.name.toLowerCase().includes(query.toLowerCase()) ||
          story.description.toLowerCase().includes(query.toLowerCase()) ||
          story.priority.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  const handleEdit = (story: UserStory): void => {
    setEditingStory(story)
    setForm({
      name: story.name,
      rol: story.rol,
      description: story.description,
      acceptance_criteria: story.acceptance_criteria,
      dod: story.dod,
      priority: story.priority,
      story_points: story.story_points,
      dependencies: story.dependencies,
      summary: story.summary,
      status_user_stories: story.status_user_stories
    })
    onOpen()
  }

  const handleCreate = (): void => {
    setEditingStory(null)
    setForm({
      name: '',
      rol: '',
      description: '',
      acceptance_criteria: '',
      dod: '',
      priority: '',
      story_points: 0,
      dependencies: '',
      summary: '',
      status_user_stories: true
    })
    onOpen()
  }

  const handleSave = async (): Promise<void> => {
    if (editingStory) {
      try {
        const updated = await userStoryService.update(
          editingStory.id,
          form.name,
          form.rol,
          form.description,
          form.acceptance_criteria,
          form.dod,
          form.priority,
          form.story_points,
          form.dependencies,
          form.status_user_stories,
          form.summary
        )
        setStories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        setFilteredStories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      } catch (e) {
        console.error(e)
      }
    } else {
      try {
        const created = await userStoryService.create(
          EPIC_ID,
          form.name,
          form.rol,
          form.description,
          form.acceptance_criteria,
          form.dod,
          form.priority,
          form.story_points,
          form.dependencies,
          form.summary
        )
        setStories((prev) => [...prev, created])
        setFilteredStories((prev) => [...prev, created])
      } catch (e) {
        console.error(e)
      }
    }
    onClose()
  }

  const handleImport = (): void => {
    // Implement import functionality
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
      name: 'rol',
      label: 'Rol',
      value: form.rol,
      onChange: (value: string) => setForm((f) => ({ ...f, rol: value })),
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
      name: 'acceptance_criteria',
      label: 'Acceptance Criteria',
      value: form.acceptance_criteria,
      onChange: (value: string) => setForm((f) => ({ ...f, acceptance_criteria: value })),
      required: true
    },
    {
      name: 'dod',
      label: 'DoD',
      value: form.dod,
      onChange: (value: string) => setForm((f) => ({ ...f, dod: value })),
      required: true
    },
    {
      name: 'priority',
      label: 'Priority',
      value: form.priority,
      onChange: (value: string) => setForm((f) => ({ ...f, priority: value })),
      required: true
    },
    {
      name: 'story_points',
      label: 'Story Points',
      value: String(form.story_points),
      onChange: (value: string) => setForm((f) => ({ ...f, story_points: Number(value) })),
      type: 'number' as const,
      required: true
    },
    {
      name: 'dependencies',
      label: 'Dependencies',
      value: form.dependencies,
      onChange: (value: string) => setForm((f) => ({ ...f, dependencies: value })),
      required: true
    },
    {
      name: 'summary',
      label: 'Summary',
      value: form.summary,
      onChange: (value: string) => setForm((f) => ({ ...f, summary: value })),
      required: true
    },
    ...(editingStory
      ? [
        {
          name: 'status_user_stories',
          label: 'Activo',
          type: "select" as const,
          value: form.status_user_stories ? '1' : '0',
          onChange: (value: string) => setForm((f) => ({ ...f, status_user_stories: value === '1' })),
          options: [
            { label: 'Activo', value: '1' },
            { label: 'Inactivo', value: '0' }
          ],
          required: true
        }
      ]
      : [])
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
          <TableColumn>NAME</TableColumn>
          <TableColumn>PRIORITY</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredStories.map((story) => (
            <TableRow key={story.id}>
              <TableCell>{story.name}</TableCell>
              <TableCell>{story.priority}</TableCell>
              <TableCell>
                <span
                  className={`px-3 py-1 rounded-2xl font-semibold text-sm ${story.status_user_stories ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'} w-24`}
                  style={{ display: 'inline-block' }}
                >
                  {story.status_user_stories ? 'Activo' : 'Inactivo'}
                </span>
              </TableCell>
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
        onSave={handleSave}
        title={editingStory ? 'Edit Story' : 'Create Story'}
        fields={fields}
      />
    </div>
  )
}

export default UserStories
