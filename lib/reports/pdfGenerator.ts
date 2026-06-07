import type { TDocumentDefinitions, Content, TableCell } from 'pdfmake/interfaces';

export interface ReportColumn {
    key: string;
    label: string;
    width?: number | string;
}

export interface ActiveFilter {
    label: string;
    value: string;
}

export async function generateReportPdf(
    title: string,
    columns: ReportColumn[],
    rows: Record<string, string | number>[],
    activeFilters?: ActiveFilter[]
) {
    // Dynamic import to avoid SSR issues
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
    (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs ?? pdfFonts;

    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    // Build filter info section
    const filterContent: Content[] = [];
    if (activeFilters && activeFilters.length > 0) {
        filterContent.push({
            text: 'Filtros aplicados:',
            style: 'filterTitle',
            margin: [0, 0, 0, 4],
        });
        filterContent.push({
            ul: activeFilters.map(f => `${f.label}: ${f.value}`),
            style: 'filterList',
            margin: [0, 0, 0, 12],
        });
    }

    // Build table header
    const headerRow: TableCell[] = columns.map(col => ({
        text: col.label,
        style: 'tableHeader',
        fillColor: '#1A2A54',
        color: '#FFFFFF',
    }));

    // Build table body
    const bodyRows: TableCell[][] = rows.map((row, idx) =>
        columns.map(col => ({
            text: String(row[col.key] ?? '—'),
            fillColor: idx % 2 === 0 ? '#F4F4F5' : '#FFFFFF',
            fontSize: 9,
            margin: [2, 4, 2, 4] as [number, number, number, number],
        }))
    );

    // Column widths
    const widths = columns.map(col => col.width ?? '*');

    const docDefinition: TDocumentDefinitions = {
        pageSize: 'A4',
        pageOrientation: columns.length > 5 ? 'landscape' : 'portrait',
        pageMargins: [40, 80, 40, 60],

        header: {
            columns: [
                {
                    text: 'CronGoal',
                    style: 'brand',
                    margin: [40, 20, 0, 0],
                },
                {
                    text: dateStr,
                    alignment: 'right' as const,
                    style: 'dateText',
                    margin: [0, 24, 40, 0],
                },
            ],
        },

        footer: (currentPage: number, pageCount: number) => ({
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'center' as const,
            style: 'footerText',
            margin: [0, 20, 0, 0],
        }),

        content: [
            { text: title, style: 'reportTitle', margin: [0, 0, 0, 4] },
            {
                text: `${rows.length} registro${rows.length !== 1 ? 's' : ''} encontrado${rows.length !== 1 ? 's' : ''}`,
                style: 'subtitle',
                margin: [0, 0, 0, 12],
            },
            ...filterContent,
            rows.length === 0
                ? { text: 'Nenhum dado encontrado para os filtros selecionados.', style: 'emptyMessage' }
                : {
                    table: {
                        headerRows: 1,
                        widths,
                        body: [headerRow, ...bodyRows],
                    },
                    layout: {
                        hLineWidth: () => 0.5,
                        vLineWidth: () => 0.5,
                        hLineColor: () => '#D4D4D8',
                        vLineColor: () => '#D4D4D8',
                    },
                },
        ],

        styles: {
            brand: {
                fontSize: 16,
                bold: true,
                color: '#1A2A54',
            },
            dateText: {
                fontSize: 9,
                color: '#5E5E5E',
            },
            reportTitle: {
                fontSize: 18,
                bold: true,
                color: '#363636',
            },
            subtitle: {
                fontSize: 10,
                color: '#5E5E5E',
            },
            filterTitle: {
                fontSize: 10,
                bold: true,
                color: '#363636',
            },
            filterList: {
                fontSize: 9,
                color: '#5E5E5E',
            },
            tableHeader: {
                fontSize: 9,
                bold: true,
                margin: [2, 5, 2, 5] as [number, number, number, number],
            },
            footerText: {
                fontSize: 8,
                color: '#94A3B8',
            },
            emptyMessage: {
                fontSize: 11,
                color: '#94A3B8',
                italics: true,
                margin: [0, 20, 0, 0] as [number, number, number, number],
            },
        },
    };

    const fileName = `crongoal_${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${now.toISOString().slice(0, 10)}.pdf`;
    pdfMake.createPdf(docDefinition).download(fileName);
}
