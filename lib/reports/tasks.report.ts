import { getTasks } from '@/services/task.service';
import { getProjects } from '@/services/project.service';
import { getRoutines } from '@/services/routine.service';
import type { ReportDefinition } from './reportTypes';
import type { ActiveFilter } from './pdfGenerator';

function formatDate(dateStr?: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export const tasksListReport: ReportDefinition = {
    id: 'tasks-list',
    title: 'Todas as Tarefas',
    category: 'list',
    module: 'tasks',
    columns: [
        { key: 'title', label: 'Título', width: '*' },
        { key: 'type', label: 'Tipo', width: 70 },
        { key: 'points', label: 'Pontos', width: 50 },
        { key: 'status', label: 'Status', width: 70 },
        { key: 'project', label: 'Projeto', width: 100 },
        { key: 'routine', label: 'Rotina', width: 100 },
    ],
    fetchAndMap: async () => {
        const tasks = await getTasks();
        return {
            rows: tasks.map(t => ({
                title: t.title,
                type: t.type === 'RECURRENT' ? 'Recorrente' : 'Única',
                points: t.generatedPoints,
                status: t.isCompleted ? 'Concluída' : 'Pendente',
                project: t.project?.title ?? '—',
                routine: (t.routineTasks && t.routineTasks.length > 0) ? (t.routineTasks[0].routine?.name ?? '—') : '—',
            })),
        };
    },
};

export const tasksFilterReport: ReportDefinition = {
    id: 'tasks-filter',
    title: 'Tarefas (com filtros)',
    category: 'filter',
    module: 'tasks',
    columns: [
        { key: 'title', label: 'Título', width: '*' },
        { key: 'type', label: 'Tipo', width: 70 },
        { key: 'points', label: 'Pontos', width: 50 },
        { key: 'status', label: 'Status', width: 70 },
        { key: 'project', label: 'Projeto', width: 100 },
        { key: 'routine', label: 'Rotina', width: 100 },
    ],
    filters: [
        {
            key: 'type',
            label: 'Tipo',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'UNIQUE', label: 'Única' },
                { value: 'RECURRENT', label: 'Recorrente' },
            ],
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'completed', label: 'Concluída' },
                { value: 'pending', label: 'Pendente' },
            ],
        },
        {
            key: 'project',
            label: 'Projeto',
            type: 'select',
            dynamicOptions: async () => {
                const projects = await getProjects();
                return [
                    { value: '', label: 'Todos' },
                    ...projects.map(p => ({ value: p.id ?? '', label: p.title })),
                ];
            },
        },
        {
            key: 'routine',
            label: 'Rotina',
            type: 'select',
            dynamicOptions: async () => {
                const routines = await getRoutines();
                return [
                    { value: '', label: 'Todas' },
                    ...routines.map(r => ({ value: r.id ?? '', label: r.name })),
                ];
            },
        },
        {
            key: 'dateFrom',
            label: 'Data de Criação (Início)',
            type: 'date',
        },
        {
            key: 'dateTo',
            label: 'Data de Criação (Fim)',
            type: 'date',
        },
    ],
    fetchAndMap: async (filterValues) => {
        let tasks = await getTasks();
        const activeFilters: ActiveFilter[] = [];

        if (filterValues?.type) {
            tasks = tasks.filter(t => t.type === filterValues.type);
            activeFilters.push({
                label: 'Tipo',
                value: filterValues.type === 'UNIQUE' ? 'Única' : 'Recorrente',
            });
        }

        if (filterValues?.status) {
            const isCompleted = filterValues.status === 'completed';
            tasks = tasks.filter(t => !!t.isCompleted === isCompleted);
            activeFilters.push({
                label: 'Status',
                value: isCompleted ? 'Concluída' : 'Pendente',
            });
        }

        if (filterValues?.project) {
            tasks = tasks.filter(t => t.projectId === filterValues.project);
            const projectName = tasks.find(t => t.projectId === filterValues.project)?.project?.title ?? filterValues.project;
            activeFilters.push({ label: 'Projeto', value: projectName });
        }

        if (filterValues?.routine) {
            tasks = tasks.filter(t => t.routineTasks?.some(rt => rt.routineId === filterValues.routine));
            let routineName = filterValues.routine;
            if (tasks.length > 0) {
                const rt = tasks[0].routineTasks?.find(rt => rt.routineId === filterValues.routine);
                if (rt?.routine?.name) routineName = rt.routine.name;
            } else {
                const routines = await getRoutines();
                routineName = routines.find(r => r.id === filterValues.routine)?.name ?? filterValues.routine;
            }
            activeFilters.push({ label: 'Rotina', value: routineName });
        }

        if (filterValues?.dateFrom) {
            const from = new Date(filterValues.dateFrom);
            tasks = tasks.filter(t => new Date(t.createdAt!) >= from);
            activeFilters.push({
                label: 'Criado a partir de',
                value: formatDate(filterValues.dateFrom),
            });
        }

        if (filterValues?.dateTo) {
            const to = new Date(filterValues.dateTo);
            to.setHours(23, 59, 59, 999);
            tasks = tasks.filter(t => new Date(t.createdAt!) <= to);
            activeFilters.push({
                label: 'Criado até',
                value: formatDate(filterValues.dateTo),
            });
        }

        return {
            rows: tasks.map(t => ({
                title: t.title,
                type: t.type === 'RECURRENT' ? 'Recorrente' : 'Única',
                points: t.generatedPoints,
                status: t.isCompleted ? 'Concluída' : 'Pendente',
                project: t.project?.title ?? '—',
                routine: (t.routineTasks && t.routineTasks.length > 0) ? (t.routineTasks[0].routine?.name ?? '—') : '—',
            })),
            activeFilters,
        };
    },
};
