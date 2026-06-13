"use client";

import { useState } from 'react';
import { LuX, LuFileText, LuFileSpreadsheet, LuFilter, LuList, LuLoader } from 'react-icons/lu';
import { getReportsByModule, type ReportDefinition } from '@/lib/reports/index';
import { generateReportPdf } from '@/lib/reports/pdfGenerator';
import { generateReportCsv } from '@/lib/reports/csvGenerator';
import ReportFilters from './ReportFilters';
import toast from 'react-hot-toast';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Module context: 'all' | 'tasks' | 'projects' | 'routines' | 'rewards' */
    module?: string;
    initialFilters?: Record<string, string>;
}

export default function ReportModal({ isOpen, onClose, module = 'all', initialFilters = {} }: ReportModalProps) {
    const [selectedReport, setSelectedReport] = useState<ReportDefinition | null>(null);
    const [filterValues, setFilterValues] = useState<Record<string, string>>(initialFilters);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const reports = getReportsByModule(module);
    const listReports = reports.filter(r => r.category === 'list');
    const filterReports = reports.filter(r => r.category === 'filter');

    const handleSelectReport = (report: ReportDefinition) => {
        setSelectedReport(report);
        setFilterValues(initialFilters);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues(prev => ({ ...prev, [key]: value }));
    };

    const handleGenerate = async (format: 'pdf' | 'csv') => {
        if (!selectedReport) return;

        setIsGenerating(true);
        try {
            const { rows, activeFilters } = await selectedReport.fetchAndMap(
                selectedReport.category === 'filter' ? filterValues : undefined
            );

            if (format === 'pdf') {
                await generateReportPdf(
                    selectedReport.title,
                    selectedReport.columns,
                    rows,
                    activeFilters
                );
            } else {
                generateReportCsv(
                    selectedReport.title,
                    selectedReport.columns,
                    rows
                );
            }

            toast.success(`Relatório exportado como ${format.toUpperCase()}!`);
        } catch (error) {
            console.error('Report generation error:', error);
            toast.error('Erro ao gerar relatório. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleBack = () => {
        setSelectedReport(null);
        setFilterValues({});
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-bg-card border border-border-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-card">
                    <div className="flex items-center gap-3">
                        <LuFileText size={22} className="text-accent" />
                        <h2 className="text-lg font-semibold text-text-primary">
                            {selectedReport ? selectedReport.title : 'Relatórios'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-bg-main transition-colors text-text-secondary hover:text-text-primary"
                    >
                        <LuX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!selectedReport ? (
                        /* Report Selection */
                        <div className="flex flex-col gap-6">
                            {/* List Reports */}
                            {listReports.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <LuList size={16} className="text-text-secondary" />
                                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                                            Listagens
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {listReports.map((report) => (
                                            <button
                                                key={report.id}
                                                onClick={() => handleSelectReport(report)}
                                                className="flex items-center gap-3 p-4 rounded-xl border border-border-card bg-bg-main hover:border-accent hover:shadow-md transition-all text-left group"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                                                    <LuFileText size={18} className="text-accent" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">{report.title}</p>
                                                    <p className="text-xs text-text-secondary">Listagem completa</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Filter Reports */}
                            {filterReports.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <LuFilter size={16} className="text-text-secondary" />
                                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                                            Com Filtros
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {filterReports.map((report) => (
                                            <button
                                                key={report.id}
                                                onClick={() => handleSelectReport(report)}
                                                className="flex items-center gap-3 p-4 rounded-xl border border-border-card bg-bg-main hover:border-secondary hover:shadow-md transition-all text-left group"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                                                    <LuFilter size={18} className="text-secondary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">{report.title}</p>
                                                    <p className="text-xs text-text-secondary">Relatório filtrável</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Report Detail / Generation */
                        <div className="flex flex-col gap-6">
                            {/* Back button */}
                            <button
                                onClick={handleBack}
                                className="text-sm text-accent hover:underline self-start"
                            >
                                ← Voltar à lista de relatórios
                            </button>

                            {/* Filters (if applicable) */}
                            {selectedReport.category === 'filter' && selectedReport.filters && (
                                <div className="p-4 rounded-xl border border-border-card bg-bg-main">
                                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                        <LuFilter size={14} />
                                        Filtros
                                    </h3>
                                    <ReportFilters
                                        filters={selectedReport.filters}
                                        values={filterValues}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            )}

                            {/* Columns preview */}
                            <div className="p-4 rounded-xl border border-border-card bg-bg-main">
                                <h3 className="text-sm font-semibold text-text-primary mb-2">Colunas do Relatório</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedReport.columns.map(col => (
                                        <span
                                            key={col.key}
                                            className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium"
                                        >
                                            {col.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                {selectedReport && (
                    <div className="p-6 border-t border-border-card flex items-center justify-end gap-3">
                        <button
                            onClick={() => handleGenerate('csv')}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-card bg-bg-main text-text-primary hover:border-accent hover:text-accent transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <LuLoader size={16} className="animate-spin" />
                            ) : (
                                <LuFileSpreadsheet size={16} />
                            )}
                            Exportar CSV
                        </button>
                        <button
                            onClick={() => handleGenerate('pdf')}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface text-white hover:bg-surface/80 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <LuLoader size={16} className="animate-spin" />
                            ) : (
                                <LuFileText size={16} />
                            )}
                            Gerar PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
