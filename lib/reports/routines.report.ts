import { getRoutines } from '@/services/routine.service';
import type { ReportDefinition } from './reportTypes';

function formatDate(dateStr?: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export const routinesListReport: ReportDefinition = {
    id: 'routines-list',
    title: 'Todas as Rotinas',
    category: 'list',
    module: 'routines',
    columns: [
        { key: 'name', label: 'Nome', width: '*' },
        { key: 'description', label: 'Descrição', width: '*' },
        { key: 'taskCount', label: 'Tarefas', width: 60 },
        { key: 'totalPoints', label: 'Pts Totais', width: 70 },
        { key: 'status', label: 'Status', width: 70 },
        { key: 'createdAt', label: 'Criação', width: 80 },
    ],
    filters: [
        {
            key: 'status',
            label: 'Status da Rotina',
            type: 'select',
            options: [
                { label: 'Todas', value: '' },
                { label: 'Pendentes', value: 'pending' },
                { label: 'Concluídas', value: 'completed' },
            ],
        },
    ],
    fetchAndMap: async (filters) => {
        let routines = await getRoutines();

        const isRoutineCompletedInPeriod = (routine: any) => {
            if (!routine.routineTasks || routine.routineTasks.length === 0) return false;
            const now = new Date();
            let periodStart = new Date(now);
            switch (routine.period) {
                case 'DAILY': periodStart.setHours(0, 0, 0, 0); break;
                case 'WEEKLY':
                    const day = periodStart.getDay();
                    periodStart.setDate(periodStart.getDate() - day + (day === 0 ? -6 : 1));
                    periodStart.setHours(0, 0, 0, 0);
                    break;
                case 'MONTHLY': periodStart.setDate(1); periodStart.setHours(0, 0, 0, 0); break;
                case 'QUARTERLY': periodStart.setMonth(Math.floor(periodStart.getMonth() / 3) * 3, 1); periodStart.setHours(0, 0, 0, 0); break;
                case 'SEMIANNUAL': periodStart.setMonth(Math.floor(periodStart.getMonth() / 6) * 6, 1); periodStart.setHours(0, 0, 0, 0); break;
                case 'ANNUAL': periodStart.setMonth(0, 1); periodStart.setHours(0, 0, 0, 0); break;
            }
            return routine.routineTasks.every((rt: any) => {
                if (!rt.task || !rt.task.registers) return false;
                return rt.task.registers.some((reg: any) => reg.isDone && new Date(reg.registerDate) >= periodStart);
            });
        };

        if (filters?.status) {
            routines = routines.filter(r => {
                const isCompleted = isRoutineCompletedInPeriod(r);
                if (filters.status === 'completed') return isCompleted;
                if (filters.status === 'pending') return !isCompleted;
                return true;
            });
        }

        return {
            rows: routines.map(r => ({
                name: r.name,
                description: r.description ?? '—',
                taskCount: r.routineTasks?.length ?? 0,
                totalPoints: r.routineTasks?.reduce((sum, rt) => sum + (rt.task?.generatedPoints || 0), 0) || 0,
                status: isRoutineCompletedInPeriod(r) ? 'Concluída' : 'Pendente',
                createdAt: formatDate(r.createdAt),
            })),
            activeFilters: filters?.status ? [{ label: 'Status da Rotina', value: filters.status === 'completed' ? 'Concluídas' : 'Pendentes' }] : undefined,
        };
    },
};
