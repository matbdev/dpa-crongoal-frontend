import { getTasks } from '@/services/task.service';
import { getProjects } from '@/services/project.service';
import { getRoutines } from '@/services/routine.service';
import { getRewards, getAllRedeems } from '@/services/reward.service';
import type { ReportColumn, ActiveFilter } from './pdfGenerator';

// ─── Filter Definitions ────────────────────────────────

export interface FilterDef {
    key: string;
    label: string;
    type: 'select' | 'date';
    options?: { value: string; label: string }[];
    // For dynamic options loaded at runtime
    dynamicOptions?: () => Promise<{ value: string; label: string }[]>;
}

// ─── Report Definition ─────────────────────────────────

export interface ReportDefinition {
    id: string;
    title: string;
    category: 'list' | 'filter';
    module: 'tasks' | 'projects' | 'routines' | 'rewards' | 'redeems';
    columns: ReportColumn[];
    filters?: FilterDef[];
    fetchAndMap: (filterValues?: Record<string, string>) => Promise<{
        rows: Record<string, string | number>[];
        activeFilters?: ActiveFilter[];
    }>;
}

// ─── Helper formatters ─────────────────────────────────

function formatDate(dateStr?: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatDateTime(dateStr?: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ─── 1. LIST: All Tasks ────────────────────────────────

const tasksListReport: ReportDefinition = {
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
            })),
        };
    },
};

// ─── 2. LIST: All Projects ─────────────────────────────

const projectsListReport: ReportDefinition = {
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

// ─── 3. LIST: All Routines ─────────────────────────────

const routinesListReport: ReportDefinition = {
    id: 'routines-list',
    title: 'Todas as Rotinas',
    category: 'list',
    module: 'routines',
    columns: [
        { key: 'name', label: 'Nome', width: '*' },
        { key: 'description', label: 'Descrição', width: '*' },
        { key: 'taskCount', label: 'Tarefas', width: 60 },
        { key: 'createdAt', label: 'Criação', width: 80 },
    ],
    fetchAndMap: async () => {
        const routines = await getRoutines();
        return {
            rows: routines.map(r => ({
                name: r.name,
                description: r.description ?? '—',
                taskCount: r.routineTasks?.length ?? 0,
                createdAt: formatDate(r.createdAt),
            })),
        };
    },
};

// ─── 4. LIST: All Rewards ──────────────────────────────

const rewardsListReport: ReportDefinition = {
    id: 'rewards-list',
    title: 'Todas as Recompensas',
    category: 'list',
    module: 'rewards',
    columns: [
        { key: 'title', label: 'Título', width: '*' },
        { key: 'description', label: 'Descrição', width: '*' },
        { key: 'cost', label: 'Custo (pts)', width: 70 },
        { key: 'status', label: 'Status', width: 60 },
    ],
    fetchAndMap: async () => {
        const rewards = await getRewards();
        return {
            rows: rewards.map(r => ({
                title: r.title,
                description: r.description ?? '—',
                cost: r.pointsToGet,
                status: r.isActive ? 'Ativa' : 'Inativa',
            })),
        };
    },
};

// ─── 5. LIST: Redeem History ───────────────────────────

const redeemsListReport: ReportDefinition = {
    id: 'redeems-list',
    title: 'Histórico de Resgates',
    category: 'list',
    module: 'redeems',
    columns: [
        { key: 'reward', label: 'Recompensa', width: '*' },
        { key: 'redeemDate', label: 'Data do Resgate', width: 120 },
        { key: 'spentPoints', label: 'Pontos Gastos', width: 80 },
    ],
    fetchAndMap: async () => {
        const redeems = await getAllRedeems();
        return {
            rows: redeems.map((r: any) => ({
                reward: r.reward?.title ?? '—',
                redeemDate: formatDateTime(r.redeemDate),
                spentPoints: r.spentPoints ?? 0,
            })),
        };
    },
};

// ─── 6. FILTER: Tasks ──────────────────────────────────

const tasksFilterReport: ReportDefinition = {
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

        return {
            rows: tasks.map(t => ({
                title: t.title,
                type: t.type === 'RECURRENT' ? 'Recorrente' : 'Única',
                points: t.generatedPoints,
                status: t.isCompleted ? 'Concluída' : 'Pendente',
                project: t.project?.title ?? '—',
            })),
            activeFilters,
        };
    },
};

// ─── 7. FILTER: Projects ───────────────────────────────

const projectsFilterReport: ReportDefinition = {
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

// ─── 8. FILTER: Redeems ────────────────────────────────

const redeemsFilterReport: ReportDefinition = {
    id: 'redeems-filter',
    title: 'Resgates (com filtros)',
    category: 'filter',
    module: 'redeems',
    columns: [
        { key: 'reward', label: 'Recompensa', width: '*' },
        { key: 'redeemDate', label: 'Data do Resgate', width: 120 },
        { key: 'spentPoints', label: 'Pontos Gastos', width: 80 },
    ],
    filters: [
        {
            key: 'reward',
            label: 'Recompensa',
            type: 'select',
            dynamicOptions: async () => {
                const rewards = await getRewards();
                return [
                    { value: '', label: 'Todas' },
                    ...rewards.map(r => ({ value: r.id ?? '', label: r.title })),
                ];
            },
        },
        {
            key: 'dateFrom',
            label: 'Data Início',
            type: 'date',
        },
        {
            key: 'dateTo',
            label: 'Data Fim',
            type: 'date',
        },
    ],
    fetchAndMap: async (filterValues) => {
        let redeems = await getAllRedeems();
        const activeFilters: ActiveFilter[] = [];

        if (filterValues?.reward) {
            const rewardName = redeems.find((r: any) => r.rewardId === filterValues.reward)?.reward?.title ?? filterValues.reward;
            redeems = redeems.filter((r: any) => r.rewardId === filterValues.reward);
            activeFilters.push({ label: 'Recompensa', value: rewardName });
        }

        if (filterValues?.dateFrom) {
            const from = new Date(filterValues.dateFrom);
            redeems = redeems.filter((r: any) => new Date(r.redeemDate) >= from);
            activeFilters.push({
                label: 'A partir de',
                value: formatDate(filterValues.dateFrom),
            });
        }

        if (filterValues?.dateTo) {
            const to = new Date(filterValues.dateTo);
            to.setHours(23, 59, 59, 999);
            redeems = redeems.filter((r: any) => new Date(r.redeemDate) <= to);
            activeFilters.push({
                label: 'Até',
                value: formatDate(filterValues.dateTo),
            });
        }

        return {
            rows: redeems.map((r: any) => ({
                reward: r.reward?.title ?? '—',
                redeemDate: formatDateTime(r.redeemDate),
                spentPoints: r.spentPoints ?? 0,
            })),
            activeFilters,
        };
    },
};

// ─── All Reports ───────────────────────────────────────

export const ALL_REPORTS: ReportDefinition[] = [
    tasksListReport,
    projectsListReport,
    routinesListReport,
    rewardsListReport,
    redeemsListReport,
    tasksFilterReport,
    projectsFilterReport,
    redeemsFilterReport,
];

export function getReportsByModule(module?: string): ReportDefinition[] {
    if (!module || module === 'all') return ALL_REPORTS;

    // For rewards page, also show redeems reports
    if (module === 'rewards') {
        return ALL_REPORTS.filter(r => r.module === 'rewards' || r.module === 'redeems');
    }

    return ALL_REPORTS.filter(r => r.module === module);
}
