"use client";

import { useEffect, useState } from "react";
import { Routine } from "@/types/routine";
import { getRoutines } from "@/services/routine.service";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import AddEditRoutinePopUp from "@/components/routines/AddEditRoutinePopUp";
import RoutineCard from "@/components/routines/RoutineCard";
import Button from "@/components/ui/Button";
import { LuPlus, LuFileText, LuSearch } from "react-icons/lu";
import ReportModal from "@/components/reports/ReportModal";

export default function RoutinesPage() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [isPopUpAddNewOpen, setIsPopUpAddNewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        getRoutines().then(setRoutines).finally(() => setIsLoading(false));
    }, []);

    const handleUpdateRoutine = (updatedRoutine: Routine) => {
        setRoutines(prev => prev.map(r => r.id === updatedRoutine.id ? updatedRoutine : r))
    };

    const handleDeleteRoutine = (deletedId: string) => {
        setRoutines(prev => prev.filter(r => r.id !== deletedId))
    };

    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Helper para saber se a rotina foi completada no período
    const isRoutineCompletedInPeriod = (routine: Routine) => {
        if (!routine.routineTasks || routine.routineTasks.length === 0) return false;

        const now = new Date();
        let periodStart = new Date(now);
        
        switch (routine.period) {
            case 'DAILY':
                periodStart.setHours(0, 0, 0, 0);
                break;
            case 'WEEKLY':
                const day = periodStart.getDay();
                const diff = periodStart.getDate() - day + (day === 0 ? -6 : 1);
                periodStart.setDate(diff);
                periodStart.setHours(0, 0, 0, 0);
                break;
            case 'MONTHLY':
                periodStart.setDate(1);
                periodStart.setHours(0, 0, 0, 0);
                break;
            case 'QUARTERLY':
                const quarterMonth = Math.floor(periodStart.getMonth() / 3) * 3;
                periodStart.setMonth(quarterMonth, 1);
                periodStart.setHours(0, 0, 0, 0);
                break;
            case 'SEMIANNUAL':
                const halfMonth = Math.floor(periodStart.getMonth() / 6) * 6;
                periodStart.setMonth(halfMonth, 1);
                periodStart.setHours(0, 0, 0, 0);
                break;
            case 'ANNUAL':
                periodStart.setMonth(0, 1);
                periodStart.setHours(0, 0, 0, 0);
                break;
        }

        return routine.routineTasks.every(rt => {
            if (!rt.task || !rt.task.registers) return false;
            return rt.task.registers.some((reg: any) => 
                reg.isDone && new Date(reg.registerDate) >= periodStart
            );
        });
    };

    const filteredRoutines = routines.filter(r => {
        let matchesFilter = true;
        if (filter !== 'all') {
            const isCompleted = isRoutineCompletedInPeriod(r);
            if (filter === 'completed') matchesFilter = isCompleted;
            if (filter === 'pending') matchesFilter = !isCompleted;
        }

        if (!matchesFilter) return false;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (
                r.name?.toLowerCase().includes(query) ||
                r.description?.toLowerCase().includes(query)
            );
        }

        return true;
    });

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
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold text-text-primary">Rotinas</h1>
                        {/* Tabs de Filtro */}
                        <div className="flex items-center gap-2 bg-bg-card p-1 rounded-lg border border-border-card w-fit">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'pending' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                Pendentes
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'completed' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                Concluídas
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block">
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input 
                                type="text"
                                placeholder="Buscar rotinas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-md border border-border-card bg-bg-card text-text-primary focus:outline-none focus:border-accent w-64 text-sm"
                            />
                        </div>
                        <button
                            onClick={() => setIsReportModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border-card bg-bg-card text-text-primary hover:border-accent hover:text-accent transition-colors text-sm font-medium"
                        >
                            <LuFileText size={16} />
                            Relatório
                        </button>
                        <Button variant="primary" text="Adicionar Nova" onClick={() => { setIsPopUpAddNewOpen(true); }} icon={<LuPlus />} />
                    </div>
                </div>

                <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} module="routines" />

                <div className="flex-1 overflow-hidden">
                    {isLoading ? null : routines.length === 0 ? (
                        <CustomEmptyList text="Nenhuma rotina encontrada" secondaryText="Cadastre uma nova rotina para começar" />
                    ) : filteredRoutines.length === 0 ? (
                        <CustomEmptyList text="Nenhuma rotina com esse status" secondaryText={searchQuery ? "Tente buscar por outro termo" : "Tente mudar o filtro."} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-8 h-full content-start">
                            {filteredRoutines.map(routine => (
                                <RoutineCard
                                    key={routine.id || routine.name}
                                    routine={routine}
                                    onUpdate={handleUpdateRoutine}
                                    onDelete={handleDeleteRoutine}
                                    isCompleted={isRoutineCompletedInPeriod(routine)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}