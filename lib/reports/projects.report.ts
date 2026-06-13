import { getProjects } from '@/services/project.service';
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

export const projectsListReport: ReportDefinition = {
    id: 'projects-list',
    title: 'Todos os Projetos',
    category: 'list',
    module: 'projects',
    columns: [
        { key: 'title', label: 'Título', width: '*' },
        { key: 'description', label: 'Descrição', width: '*' },
        { key: 'limitDate', label: 'Data Limite', width: 80 },
        { key: 'status', label: 'Status', width: 70 },
        { key: 'taskCount', label: 'Tarefas', width: 50 },
    ],
    fetchAndMap: async () => {
        const projects = await getProjects();
        return {
            rows: projects.map(p => ({
                title: p.title,
                description: p.description ?? '—',
                limitDate: formatDate(p.limitDate),
                status: p.isCompleted ? 'Concluído' : 'Ativo',
                taskCount: p.tasks?.length ?? 0,
            })),
        };
    },
};

export const projectsFilterReport: ReportDefinition = {
    id: 'projects-filter',
    title: 'Projetos (com filtros)',
    category: 'filter',
    module: 'projects',
    columns: [
        { key: 'title', label: 'Título', width: '*' },
        { key: 'description', label: 'Descrição', width: '*' },
        { key: 'limitDate', label: 'Data Limite', width: 80 },
        { key: 'status', label: 'Status', width: 70 },
        { key: 'taskCount', label: 'Tarefas', width: 50 },
    ],
    filters: [
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'completed', label: 'Concluído' },
                { value: 'active', label: 'Ativo' },
            ],
        },
        {
            key: 'deadline',
            label: 'Prazo',
            type: 'select',
            options: [
                { value: '', label: 'Todos' },
                { value: 'overdue', label: 'Vencidos' },
                { value: 'week', label: 'Próximos 7 dias' },
                { value: 'month', label: 'Próximos 30 dias' },
            ],
        },
    ],
    fetchAndMap: async (filterValues) => {
        let projects = await getProjects();
        const activeFilters: ActiveFilter[] = [];
        const now = new Date();

        if (filterValues?.status) {
            const isCompleted = filterValues.status === 'completed';
            projects = projects.filter(p => !!p.isCompleted === isCompleted);
            activeFilters.push({
                label: 'Status',
                value: isCompleted ? 'Concluído' : 'Ativo',
            });
        }

        if (filterValues?.deadline) {
            const deadlineMap: Record<string, string> = {
                overdue: 'Vencidos',
                week: 'Próximos 7 dias',
                month: 'Próximos 30 dias',
            };

            projects = projects.filter(p => {
                const limit = new Date(p.limitDate);
                switch (filterValues.deadline) {
                    case 'overdue':
                        return limit < now;
                    case 'week': {
                        const inWeek = new Date();
                        inWeek.setDate(inWeek.getDate() + 7);
                        return limit >= now && limit <= inWeek;
                    }
                    case 'month': {
                        const inMonth = new Date();
                        inMonth.setDate(inMonth.getDate() + 30);
                        return limit >= now && limit <= inMonth;
                    }
                    default:
                        return true;
                }
            });

            activeFilters.push({
                label: 'Prazo',
                value: deadlineMap[filterValues.deadline] ?? filterValues.deadline,
            });
        }

        return {
            rows: projects.map(p => ({
                title: p.title,
                description: p.description ?? '—',
                limitDate: formatDate(p.limitDate),
                status: p.isCompleted ? 'Concluído' : 'Ativo',
                taskCount: p.tasks?.length ?? 0,
            })),
            activeFilters,
        };
    },
};
