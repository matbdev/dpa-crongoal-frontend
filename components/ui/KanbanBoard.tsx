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
    getId: (item: T) => string;
    onItemMove?: (itemId: string, sourceColId: string, destColId: string) => void;
    isItemDraggable?: (item: T) => boolean;
}

export default function KanbanBoard<T>({ 
    columns, 
    renderCard, 
    emptyText = "Nenhum item",
    getId,
    onItemMove,
    isItemDraggable
}: KanbanBoardProps<T>) {
    
    const handleDragStart = (e: React.DragEvent, itemId: string, sourceColId: string) => {
        e.dataTransfer.setData("itemId", itemId);
        e.dataTransfer.setData("sourceColId", sourceColId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent, destColId: string) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData("itemId");
        const sourceColId = e.dataTransfer.getData("sourceColId");
        
        if (itemId && sourceColId && sourceColId !== destColId) {
            if (onItemMove) {
                onItemMove(itemId, sourceColId, destColId);
            }
        }
    };

    return (
        <div className="flex h-full gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
                <div 
                    key={column.id} 
                    className="flex-1 min-w-[320px] bg-bg-card border border-border-card rounded-xl flex flex-col overflow-hidden"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                >
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
                            column.items.map(item => {
                                const itemId = getId(item);
                                const draggable = isItemDraggable ? isItemDraggable(item) : true;
                                return (
                                    <div 
                                        key={itemId}
                                        draggable={draggable}
                                        onDragStart={draggable ? (e) => handleDragStart(e, itemId, column.id) : undefined}
                                        className={draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default opacity-80"}
                                    >
                                        {renderCard(item)}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
