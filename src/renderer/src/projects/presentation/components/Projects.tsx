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
import { Project } from '@renderer/projects/domain/Project';
import { ProjectService } from '@renderer/projects/application/ProjectService';
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

const projectService = new ProjectService(new ApiProjectRepository());

const Projects: React.FC = () => {
    const notify = useNotification();
    const userId = getUserId();

    const fetchProjectsByUser = useCallback(
        (page: number, size: number) => projectService.listByUser(userId!, page, size),
        [userId]
    );

    const {
        items: projects,
        loading,
        error,
        currentPage,
        pageSize,
        totalItems,
        handlePageChange,
        handlePageSizeChange,
        refreshData,
        refreshing,
    } = usePagination<Project>({
        apiFn: fetchProjectsByUser,
        initialPage: 1,
        initialSize: 10,
    });

    const [searchQuery, setSearchQuery] = React.useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editingProject, setEditingProject] = React.useState<Project | null>(null);
    const [form, setForm] = React.useState({ name: '', description: '' });
    const [saving, setSaving] = React.useState(false);

    const filteredProjects = React.useMemo(() => {
        if (!searchQuery.trim()) return projects;
        return projects.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, projects]);

    const handleSearch = (value: string): void => {
        setSearchQuery(value);
    };

    // Abrir modal para crear
    const handleCreate = (): void => {
        setEditingProject(null);
        setForm({ name: '', description: '' });
        onOpen();
    };

    // Abrir modal para editar
    const handleEdit = (project: Project): void => {
        setEditingProject(project);
        setForm({
            name: project.name,
            description: project.description,
        });
        onOpen();
    };

    const handleSave = async (): Promise<void> => {
        if (!form.name.trim()) return notify('El nombre es requerido', 'error');
        if (!form.description.trim()) return notify('La descripción es requerida', 'error');

        setSaving(true);
        try {
            if (editingProject) {
                await projectService.update(editingProject.id, form.name, form.description);
                await refreshData();
                notify('Proyecto actualizado correctamente', 'success');
            } else {
                await projectService.create(userId!, form.name, form.description);
                await refreshData();
                notify('Proyecto creado correctamente', 'success');
            }
            onClose();
        } catch (err: unknown) {
            console.error('Error saving project:', err);
            const errorMessage = err instanceof Error ? err.message : 'desconocido';
            notify(`Error al ${editingProject ? 'actualizar' : 'crear'} el proyecto: ${errorMessage}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const fields = [
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
        notify('Error al cargar proyectos', 'error');
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Projects</h1>
                <Button color="primary" onPress={handleCreate}>
                    <Icon icon="lucide:plus" className="mr-2" /> Create Project
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder="Search projects..."
                value={searchQuery}
                onValueChange={handleSearch}
                startContent={<Icon icon="lucide:search" />}
                className="max-w-xs"
            />

            {/* Table */}
            <div className="relative">
                <Table aria-label="Projects table" removeWrapper>
                    <TableHeader>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>DESCRIPTION</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No projects found">
                        {filteredProjects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>
                                    <div className="max-w-xs truncate" title={project.description}>
                                        {project.description}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button size="sm" variant="light" onPress={() => handleEdit(project)}>
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
                title={editingProject ? 'Edit Project' : 'Create Project'}
                fields={fields}
                saveLabel={saving ? 'Saving...' : 'Save'}
                cancelLabel="Cancel"
            />
        </div>
    );
};

export default Projects;
