import type { ReportColumn, ActiveFilter } from './pdfGenerator';

export interface FilterDef {
    key: string;
    label: string;
    type: 'select' | 'date';
    options?: { value: string; label: string }[];
    // For dynamic options loaded at runtime
    dynamicOptions?: () => Promise<{ value: string; label: string }[]>;
}

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
