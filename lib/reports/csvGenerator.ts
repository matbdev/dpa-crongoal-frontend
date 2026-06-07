import type { ReportColumn } from './pdfGenerator';

export function generateReportCsv(
    title: string,
    columns: ReportColumn[],
    rows: Record<string, string | number>[]
) {
    // Header row
    const headerLine = columns.map(col => `"${col.label}"`).join(',');

    // Data rows
    const dataLines = rows.map(row =>
        columns.map(col => {
            const val = row[col.key] ?? '';
            // Escape double quotes inside values
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(',')
    );

    // BOM + content (BOM ensures Excel opens with correct encoding)
    const bom = '\uFEFF';
    const csvContent = bom + [headerLine, ...dataLines].join('\n');

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const now = new Date();
    const fileName = `crongoal_${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${now.toISOString().slice(0, 10)}.csv`;

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
