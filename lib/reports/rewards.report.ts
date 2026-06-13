import { getRewards } from '@/services/reward.service';
import type { ReportDefinition } from './reportTypes';

export const rewardsListReport: ReportDefinition = {
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
