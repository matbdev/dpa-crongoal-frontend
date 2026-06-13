import type { ReportColumn, ActiveFilter } from './pdfGenerator';
import { tasksListReport, tasksFilterReport } from './tasks.report';
import { projectsListReport, projectsFilterReport } from './projects.report';
import { routinesListReport } from './routines.report';
import { rewardsListReport } from './rewards.report';
import { redeemsListReport, redeemsFilterReport } from './redeems.report';

export * from './reportTypes';
import type { ReportDefinition } from './reportTypes';

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
