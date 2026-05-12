"use client";

import { useEffect, useState } from "react";
import { Routine } from "@/types/routine";
import { getRoutines } from "@/services/routine.service";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import AddEditRoutinePopUp from "@/components/routines/AddEditRoutinePopUp";
import RoutineCard from "@/components/routines/RoutineCard";
import Button from "@/components/ui/Button";
import { LuPlus, LuLayoutGrid, LuSquareKanban } from "react-icons/lu";
import KanbanBoard, { KanbanColumnDef } from "@/components/ui/KanbanBoard";

export default function RoutinesPage() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [isPopUpAddNewOpen, setIsPopUpAddNewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('kanban');

    useEffect(() => {
        getRoutines().then(setRoutines).finally(() => setIsLoading(false));
    }, []);

    const handleUpdateRoutine = (updatedRoutine: Routine) => {
        setRoutines(prev => prev.map(r => r.id === updatedRoutine.id ? updatedRoutine : r))
    };

    const handleDeleteRoutine = (deletedId: string) => {
        setRoutines(prev => prev.filter(r => r.id !== deletedId))
    };

    const kanbanColumns: KanbanColumnDef<Routine>[] = [
        { id: "active", title: "Ativas", items: routines },
        { id: "paused", title: "Pausadas", items: [] },
        { id: "archived", title: "Arquivadas", items: [] },
    ];

    return (
        <div className="p-8 h-[calc(100vh-80px)] flex flex-col">
            {isPopUpAddNewOpen && <AddEditRoutinePopUp
                onClose={() => { setIsPopUpAddNewOpen(false); }}
                onSuccess={(newRoutine) => {
                    setRoutines(prev => [...prev, newRoutine]);
                    setIsPopUpAddNewOpen(false);
                }}
            />}

            <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-semibold text-text-primary">Rotinas</h1>
                        
                        {/* View Toggle */}
                        <div className="flex items-center bg-bg-card border border-border-card rounded-lg p-1">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                title="Visualização em Grade"
                            >
                                <LuLayoutGrid size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode('kanban')}
                                className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'kanban' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                title="Visualização Kanban"
                            >
                                <LuSquareKanban size={18} />
                            </button>
                        </div>
                    </div>
                    <Button variant="primary" text="Adicionar Nova" onClick={() => { setIsPopUpAddNewOpen(true); }} icon={<LuPlus />} />
                </div>

                <div className="flex-1 overflow-hidden">
                    {isLoading ? null : routines.length === 0 ? (
                        <CustomEmptyList text="Nenhuma rotina encontrada" secondaryText="Cadastre uma nova rotina para começar" />
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-8 h-full content-start">
                            {routines.map(routine => (
                                <RoutineCard
                                    key={routine.id || routine.name}
                                    routine={routine}
                                    onUpdate={handleUpdateRoutine}
                                    onDelete={handleDeleteRoutine}
                                />
                            ))}
                        </div>
                    ) : (
                        <KanbanBoard<Routine>
                            columns={kanbanColumns}
                            emptyText="Nenhuma rotina"
                            renderCard={(routine) => (
                                <RoutineCard
                                    key={routine.id || routine.name}
                                    routine={routine}
                                    onUpdate={handleUpdateRoutine}
                                    onDelete={handleDeleteRoutine}
                                />
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}