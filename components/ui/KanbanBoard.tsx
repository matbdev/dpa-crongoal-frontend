import { ReactNode } from "react";

export interface KanbanColumnDef<T> {
    id: string;
    title: string;
    items: T[];
}

interface KanbanBoardProps<T> {
    columns: KanbanColumnDef<T>[];
    renderCard: (item: T) => ReactNode;
    emptyText?: string;
}

export default function KanbanBoard<T>({ columns, renderCard, emptyText = "Nenhum item" }: KanbanBoardProps<T>) {
    return (
        <div className="flex h-full gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
                <div key={column.id} className="shrink-0 w-[350px] bg-bg-card border border-border-card rounded-xl flex flex-col overflow-hidden">
                    {/* Column Header */}
                    <div className="p-4 border-b border-border-card bg-bg-main/50 flex justify-between items-center">
                        <h3 className="font-semibold text-text-primary">{column.title}</h3>
                        <span className="bg-bg-main px-2 py-0.5 rounded-full text-xs font-bold text-text-secondary border border-border-card">
                            {column.items.length}
                        </span>
                    </div>

                    {/* Column Content */}
                    <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4 min-h-[200px]">
                        {column.items.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-text-secondary/50 text-sm italic">
                                {emptyText}
                            </div>
                        ) : (
                            column.items.map(renderCard)
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
