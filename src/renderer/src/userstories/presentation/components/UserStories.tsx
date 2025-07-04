import React, { useCallback } from 'react';
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
  Spinner,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';

import { usePagination } from '../../../shared/hooks/usePagination';
import EditCreateModal from '../../../shared/components/EditCreateModal';
import Paginator from '../../../shared/components/Paginator';
import { UserStory } from '@renderer/userstories/domain/userStory';
import { UserStoryService } from '@renderer/userstories/application/UserStoryService';
import { ApiUserStoryRepository } from '@renderer/userstories/infrastructure/ApiUserStoryRepository';
import { ApiProjectRepository } from '@renderer/projects/infrastructure/ApiProjectRepository';
import { ApiEpicRepository } from '@renderer/epics/infrastructure/ApiEpicRepository';
import { useNotification } from '@renderer/shared/utils/useNotification';
import ImportModal from './ImportModal';

const getUserId = (): number | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user).id;
  } catch {
    return null;
  }
};

const userStoryService = new UserStoryService(new ApiUserStoryRepository());
const projectRepository = new ApiProjectRepository();
const epicRepository = new ApiEpicRepository();

const UserStories: React.FC = () => {
  const notify = useNotification();
  const userId = getUserId();

  const fetchUserStoriesByUser = useCallback(
    (page: number, size: number) => userStoryService.listByUserPaginated(userId!, page, size),
    [userId]
  );

  const {
    items: stories,
    loading,
    error,
    currentPage,
    pageSize,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
    refreshData,
    refreshing,
  } = usePagination<UserStory>({
    apiFn: fetchUserStoriesByUser,
    initialPage: 1,
    initialSize: 10,
  });

  const [searchQuery, setSearchQuery] = React.useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose
  } = useDisclosure();
  const [editingStory, setEditingStory] = React.useState<UserStory | null>(null);
  const [form, setForm] = React.useState({
    project_id: '',
    epic_id: '',
    fakeId: '',
    name: '',
    role: '',
    description: '',
    criteria: '',
    dod: '',
    priority: '',
    points: 0,
    dependencies: '',
    summary: ''
  });
  const [saving, setSaving] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [projectOptions, setProjectOptions] = React.useState<{ id: number; name: string }[]>([]);
  const [projectLoading, setProjectLoading] = React.useState(false);
  const [epicOptions, setEpicOptions] = React.useState<{ id: number; second_id: string; name: string }[]>([]);
  const [epicLoading, setEpicLoading] = React.useState(false);

  const filteredStories = React.useMemo(() => {
    if (!searchQuery.trim()) return stories;
    return stories.filter((story) =>
      story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.fakeId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, stories]);

  const handleSearch = (value: string): void => {
    setSearchQuery(value);
  };

  // Abrir modal para crear
  const handleCreate = (): void => {
    setEditingStory(null);
    handleProjectSelectOpen();
    setForm({
      project_id: '',
      epic_id: '',
      fakeId: '',
      name: '',
      role: '',
      description: '',
      criteria: '',
      dod: '',
      priority: '',
      points: 0,
      dependencies: '',
      summary: ''
    });
    onOpen();
  };

  // Abrir modal para editar
  const handleEdit = (story: UserStory): void => {
    setEditingStory(story);
    setForm({
      project_id: '',
      epic_id: '',
      fakeId: story.fakeId,
      name: story.name,
      role: story.role,
      description: story.description,
      criteria: story.criteria,
      dod: story.dod,
      priority: story.priority,
      points: story.points,
      dependencies: story.dependencies,
      summary: story.summary
    });
    onOpen();
  };

  const handleSave = async (): Promise<void> => {
    if (!form.name.trim()) return notify('El nombre es requerido', 'error');
    if (!form.role.trim()) return notify('El rol es requerido', 'error');
    if (!form.description.trim()) return notify('La descripción es requerida', 'error');
    if (!editingStory && !form.epic_id) return notify('La épica es requerida', 'error');

    setSaving(true);
    try {
      if (editingStory) {
        await userStoryService.update(
          editingStory.id,
          form.name,
          form.role,
          form.description,
          form.criteria,
          form.dod,
          form.priority,
          form.points,
          form.dependencies,
          form.summary
        );
        await refreshData(); // Refrescar datos sin cambiar página
        notify('Historia de usuario actualizada correctamente', 'success');
      } else {
        await userStoryService.create(
          Number(form.epic_id),
          form.fakeId,
          form.name,
          form.role,
          form.description,
          form.criteria,
          form.dod,
          form.priority,
          form.points,
          form.dependencies,
          form.summary
        );
        await refreshData(); // Refrescar datos sin cambiar página
        notify('Historia de usuario creada correctamente', 'success');
      }
      onClose();
    } catch (err: unknown) {
      console.error('Error saving user story:', err);
      const errorMessage = err instanceof Error ? err.message : 'desconocido';
      notify(`Error al ${editingStory ? 'actualizar' : 'crear'} la historia de usuario: ${errorMessage}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImport = (): void => {
    handleProjectSelectOpen();
    onImportOpen();
  };

  const handleImportConfirm = async (projectId: number, file: File): Promise<void> => {
    if (!userId) return;

    setIsImporting(true);
    try {
      await userStoryService.importFromExcel(projectId, file);
      await refreshData(); // Refrescar datos después de importar
      notify('Historias importadas correctamente', 'success');
      onImportClose();
    } catch (err: unknown) {
      console.error('Error importing stories:', err);
      const errorMessage = err instanceof Error ? err.message : 'desconocido';
      notify(`Error al importar historias: ${errorMessage}`, 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleProjectSelectOpen = async (): Promise<void> => {
    if (!userId) return;
    setProjectLoading(true);
    try {
      const projects = await projectRepository.listShort(userId);
      setProjectOptions(projects.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name })));
    } catch (err) {
      console.error('Error loading projects:', err);
      notify('Error al cargar proyectos', 'error');
    } finally {
      setProjectLoading(false);
    }
  };

  const handleEpicSelectOpen = async (): Promise<void> => {
    if (!form.project_id) return;
    setEpicLoading(true);
    try {
      const epics = await epicRepository.listShort(Number(form.project_id));
      setEpicOptions(epics.map((e: { id: number; fake_id: string; name: string }) => ({
        id: e.id,
        second_id: e.fake_id,
        name: e.name
      })));
    } catch (err) {
      console.error('Error loading epics:', err);
      notify('Error al cargar épicas', 'error');
    } finally {
      setEpicLoading(false);
    }
  };

  const fields = [
    ...(!editingStory
      ? [
        {
          name: 'project_id',
          label: 'Proyecto',
          type: 'select' as const,
          value: form.project_id,
          onChange: (value: string) => {
            setForm((f) => ({ ...f, project_id: value, epic_id: '' }));
            setEpicOptions([]);
            if (value) {
              handleEpicSelectOpen();
            }
          },
          options: projectOptions.map((p) => ({
            label: p.name,
            value: String(p.id)
          })),
          required: true,
          placeholder: projectLoading ? 'Cargando proyectos...' : 'Selecciona un proyecto'
        },
        {
          name: 'epic_id',
          label: 'Épica',
          type: 'select' as const,
          value: form.epic_id,
          onChange: (value: string) => setForm((f) => ({ ...f, epic_id: value })),
          options: epicOptions.map((e) => ({
            label: `${e.second_id} - ${e.name}`,
            value: String(e.id)
          })),
          required: true,
          placeholder: epicLoading ? 'Cargando épicas...' : 'Selecciona una épica',
          disabled: !form.project_id
        }
      ]
      : []
    ),
    {
      name: 'fakeId',
      label: 'Story ID',
      value: form.fakeId,
      onChange: (value: string) => setForm((f) => ({ ...f, fakeId: value })),
      required: true
    },
    {
      name: 'name',
      label: 'Name',
      value: form.name,
      onChange: (value: string) => setForm((f) => ({ ...f, name: value })),
      required: true
    },
    {
      name: 'role',
      label: 'Role',
      value: form.role,
      onChange: (value: string) => setForm((f) => ({ ...f, role: value })),
      required: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      value: form.description,
      onChange: (value: string) => setForm((f) => ({ ...f, description: value })),
      required: true
    },
    {
      name: 'criteria',
      label: 'Acceptance Criteria',
      type: 'textarea' as const,
      value: form.criteria,
      onChange: (value: string) => setForm((f) => ({ ...f, criteria: value })),
      required: true
    },
    {
      name: 'dod',
      label: 'Definition of Done',
      type: 'textarea' as const,
      value: form.dod,
      onChange: (value: string) => setForm((f) => ({ ...f, dod: value })),
      required: true
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select' as const,
      value: form.priority,
      onChange: (value: string) => setForm((f) => ({ ...f, priority: value })),
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
      ],
      required: true
    },
    {
      name: 'points',
      label: 'Story Points',
      type: 'number' as const,
      value: String(form.points),
      onChange: (value: string) => setForm((f) => ({ ...f, points: Number(value) || 0 })),
      required: true
    },
    {
      name: 'dependencies',
      label: 'Dependencies',
      type: 'textarea' as const,
      value: form.dependencies,
      onChange: (value: string) => setForm((f) => ({ ...f, dependencies: value })),
      required: false
    },
    {
      name: 'summary',
      label: 'Summary',
      type: 'textarea' as const,
      value: form.summary,
      onChange: (value: string) => setForm((f) => ({ ...f, summary: value })),
      required: true
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  if (error) {
    notify('Error al cargar historias de usuario', 'error');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Search */}
      <Input
        placeholder="Search stories..."
        value={searchQuery}
        onValueChange={handleSearch}
        startContent={<Icon icon="lucide:search" />}
        className="max-w-xs"
      />

      {/* Table */}
      <div className="relative">
        <Table aria-label="User stories table" removeWrapper>
          <TableHeader>
            <TableColumn>STORY ID</TableColumn>
            <TableColumn>NAME</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>PRIORITY</TableColumn>
            <TableColumn>POINTS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No user stories found">
            {filteredStories.map((story) => (
              <TableRow key={story.id}>
                <TableCell>{story.fakeId}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={story.name}>
                    {story.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={story.role}>
                    {story.role}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${story.priority === 'High' ? 'bg-red-100 text-red-800' :
                    story.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {story.priority}
                  </span>
                </TableCell>
                <TableCell>{story.points}</TableCell>
                <TableCell>
                  <Button size="sm" variant="light" onPress={() => handleEdit(story)}>
                    <Icon icon="lucide:edit" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Table Loading Overlay */}
        {refreshing && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm">Updating...</span>
            </div>
          </div>
        )}
      </div>

      {/* Paginator */}
      <Paginator
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        pageSizeOptions={[10, 15, 25, 50]}
        showFirstLastButtons
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Modal */}
      <EditCreateModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        title={editingStory ? 'Edit User Story' : 'Create User Story'}
        fields={fields}
        saveLabel={saving ? 'Saving...' : 'Save'}
        cancelLabel="Cancel"
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={onImportClose}
        onImport={handleImportConfirm}
        loading={isImporting}
        projectOptions={projectOptions}
        projectLoading={projectLoading}
        onProjectSelectOpen={handleProjectSelectOpen}
      />
    </div>
  );
};

export default UserStories;
