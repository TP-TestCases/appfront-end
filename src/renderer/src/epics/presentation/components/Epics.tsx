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
import { Epic } from '@renderer/epics/domain/Epic';
import { EpicService } from '@renderer/epics/application/EpicService';
import { ApiEpicRepository } from '@renderer/epics/infrastructure/ApiEpicRepository';
import { ApiProjectRepository } from '@renderer/projects/infrastructure/ApiProjectRepository';
import { useNotification } from '@renderer/shared/utils/useNotification';

const getUserId = (): number | null => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
        return JSON.parse(user).id;
    } catch {
        return null;
    }
};

const epicService = new EpicService(new ApiEpicRepository());
const projectRepository = new ApiProjectRepository();

const Epics: React.FC = () => {
    const notify = useNotification();
    const userId = getUserId();

    const fetchEpicsByUser = useCallback(
        (page: number, size: number) => epicService.listByUser(userId!, page, size),
        [userId]
    );

    const {
        items: epics,
        loading,
        error,
        currentPage,
        pageSize,
        totalItems,
        handlePageChange,
        handlePageSizeChange,
    } = usePagination<Epic>({
        apiFn: fetchEpicsByUser,
        initialPage: 1,
        initialSize: 10,
    });

    const [searchQuery, setSearchQuery] = React.useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editingEpic, setEditingEpic] = React.useState<Epic | null>(null);
    const [form, setForm] = React.useState({ project_id: '', fake_id: '', name: '', description: '' });
    const [saving, setSaving] = React.useState(false);
    const [projectOptions, setProjectOptions] = React.useState<{ id: number; name: string }[]>([]);
    const [projectLoading, setProjectLoading] = React.useState(false);

    const filteredEpics = React.useMemo(() => {
        if (!searchQuery.trim()) return epics;
        return epics.filter((e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.fake_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, epics]);

    const handleSearch = (value: string): void => {
        setSearchQuery(value);
    };

    // Abrir modal para crear
    const handleCreate = (): void => {
        setEditingEpic(null);
        setForm({ project_id: '', fake_id: '', name: '', description: '' });
        onOpen();
    };

    // Abrir modal para editar
    const handleEdit = (epic: Epic): void => {
        setEditingEpic(epic);
        setForm({
            project_id: String(epic.project_id),
            fake_id: epic.fake_id,
            name: epic.name,
            description: epic.description,
        });
        onOpen();
    };

    const handleSave = async (): Promise<void> => {
        if (!form.name.trim()) return notify('El nombre es requerido', 'error');
        if (!form.description.trim()) return notify('La descripción es requerida', 'error');
        if (!editingEpic && !form.fake_id.trim()) return notify('El ID de la épica es requerido', 'error');
        if (!editingEpic && !form.project_id) return notify('El proyecto es requerido', 'error');

        setSaving(true);
        try {
            if (editingEpic) {
                await epicService.update(editingEpic.id, form.name, form.description);
                handlePageChange(currentPage);
                notify('Épica actualizada correctamente', 'success');
            } else {
                await epicService.create(form.fake_id, form.name, form.description, Number(form.project_id));
                handlePageChange(1);
                notify('Épica creada correctamente', 'success');
            }
            onClose();
        } catch (err: unknown) {
            console.error('Error saving epic:', err);
            const errorMessage = err instanceof Error ? err.message : 'desconocido';
            notify(`Error al ${editingEpic ? 'actualizar' : 'crear'} la épica: ${errorMessage}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleProjectSelectOpen = async (): Promise<void> => {
        if (!userId) return;
        setProjectLoading(true);
        try {
            const projects = await projectRepository.listShort(userId);
            setProjectOptions(projects.map((p) => ({ id: p.id, name: p.name })));
        } catch (err) {
            console.error('Error loading projects:', err);
            notify('Error al cargar proyectos', 'error');
        } finally {
            setProjectLoading(false);
        }
    };

    const fields = [
        ...(!editingEpic
            ? [
                {
                    name: 'project_id',
                    label: 'Project',
                    type: 'select' as const,
                    value: form.project_id,
                    onChange: (v: string) => setForm((f) => ({ ...f, project_id: v })),
                    options: projectOptions.map((p) => ({ label: p.name, value: String(p.id) })),
                    required: true,
                    onOpen: handleProjectSelectOpen,
                    placeholder: projectLoading ? 'Loading projects...' : 'Select a project',
                },
                {
                    name: 'fake_id',
                    label: 'Epic ID',
                    value: form.fake_id,
                    onChange: (v: string) => setForm((f) => ({ ...f, fake_id: v })),
                    required: true,
                },
            ]
            : []),
        {
            name: 'name',
            label: 'Name',
            value: form.name,
            onChange: (v: string) => setForm((f) => ({ ...f, name: v })),
            required: true,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea' as const,
            value: form.description,
            onChange: (v: string) => setForm((f) => ({ ...f, description: v })),
            required: true,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }
    if (error) {
        notify('Error al cargar épicas', 'error');
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Epics</h1>
                <Button color="primary" onPress={handleCreate}>
                    <Icon icon="lucide:plus" className="mr-2" /> Create Epic
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder="Search epics..."
                value={searchQuery}
                onValueChange={handleSearch}
                startContent={<Icon icon="lucide:search" />}
                className="max-w-xs"
            />

            {/* Table */}
            <Table aria-label="Epics table" removeWrapper>
                <TableHeader>
                    <TableColumn>EPIC ID</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No epics found">
                    {filteredEpics.map((epic) => (
                        <TableRow key={epic.id}>
                            <TableCell>{epic.fake_id}</TableCell>
                            <TableCell>{epic.name}</TableCell>
                            <TableCell>
                                <div className="max-w-xs truncate" title={epic.description}>
                                    {epic.description}
                                </div>
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
                title={editingEpic ? 'Edit Epic' : 'Create Epic'}
                fields={fields}
                saveLabel={saving ? 'Saving...' : 'Save'}
                cancelLabel="Cancel"
            />

            {/* Project Loading Overlay */}
            {projectLoading && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg flex items-center gap-3">
                        <Spinner size="md" />
                        <span>Loading projects...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Epics;
