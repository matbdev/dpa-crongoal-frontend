import { getRewards, getAllRedeems } from '@/services/reward.service';
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

export const redeemsListReport: ReportDefinition = {
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

export const redeemsFilterReport: ReportDefinition = {
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
