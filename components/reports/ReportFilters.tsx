"use client";

import { useEffect, useState } from 'react';
import type { FilterDef } from '@/lib/reports/index';

interface ReportFiltersProps {
    filters: FilterDef[];
    values: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

export default function ReportFilters({ filters, values, onChange }: ReportFiltersProps) {
    // Load dynamic options
    const [dynamicOpts, setDynamicOpts] = useState<Record<string, { value: string; label: string }[]>>({});

    useEffect(() => {
        filters.forEach(async (f) => {
            if (f.dynamicOptions) {
                const opts = await f.dynamicOptions();
                setDynamicOpts(prev => ({ ...prev, [f.key]: opts }));
            }
        });
    }, [filters]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filters.map((filter) => {
                if (filter.type === 'select') {
                    const options = filter.options ?? dynamicOpts[filter.key] ?? [];
                    return (
                        <div key={filter.key} className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary">{filter.label}</label>
                            <select
                                value={values[filter.key] ?? ''}
                                onChange={(e) => onChange(filter.key, e.target.value)}
                                className="px-3 py-2 text-sm rounded-lg border border-border-card bg-bg-main text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                {options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }

                if (filter.type === 'date') {
                    return (
                        <div key={filter.key} className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary">{filter.label}</label>
                            <input
                                type="date"
                                value={values[filter.key] ?? ''}
                                onChange={(e) => onChange(filter.key, e.target.value)}
                                className="px-3 py-2 text-sm rounded-lg border border-border-card bg-bg-main text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}
