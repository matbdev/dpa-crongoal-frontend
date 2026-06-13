import { Routine } from "@/types/routine";
import { LuPencil, LuTrash2, LuRepeat, LuCoins } from "react-icons/lu";
import * as RoutineService from "@/services/routine.service";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { useState } from "react";
import AddEditRoutinePopUp from "./AddEditRoutinePopUp";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import { useRouter } from "next/navigation";

interface RoutineCardProps {
    routine: Routine;
    onUpdate?: (updatedRoutine: Routine) => void;
    onDelete?: (deletedId: string) => void;
    isCompleted?: boolean;
}

export default function RoutineCard({ routine, onUpdate, onDelete, isCompleted }: RoutineCardProps) {
    const router = useRouter();
    const [isPopUpEditOpen, setIsPopUpEditOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    const handleUpdateRoutine = (updatedRoutine: Routine) => {
        if (onUpdate) onUpdate(updatedRoutine);
    };

    const handleEditRoutine = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPopUpEditOpen(true);
    };

    const handleDeleteRoutine = async () => {
        try {
            if (routine.id) {
                await RoutineService.deleteRoutine(routine.id);
                toast.success("Rotina excluída com sucesso!");
                if (onDelete) onDelete(routine.id);
            }
        } catch (error: any) {
            const message = error.response?.data?.error ||
                "Erro ao excluir rotina";
            toast.error(message);
            console.error(error);
        };
    };

    const handleCardClick = () => {
        router.push(`/routines/${routine.id}`);
    };

    return (
        <div onClick={handleCardClick} className={`flex flex-col gap-3 rounded-xl p-5 border transition-all cursor-pointer bg-bg-card border-border-card hover:border-accent hover:shadow-md ${isCompleted ? 'opacity-60' : ''}`}>
            {isPopUpEditOpen && <AddEditRoutinePopUp
                onClose={() => { setIsPopUpEditOpen(false) }}
                onSuccess={(updatedRoutine: Routine) => {
                    setIsPopUpEditOpen(false);
                    handleUpdateRoutine(updatedRoutine);
                }}
                routine={routine}
            />}
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleDeleteRoutine}
                itemName={routine.name}
            />
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                                <LuRepeat className="inline mr-1" size={12} />
                                {routine.period === 'DAILY' && 'Diário'}
                                {routine.period === 'WEEKLY' && 'Semanal'}
                                {routine.period === 'MONTHLY' && 'Mensal'}
                                {routine.period === 'QUARTERLY' && 'Trimestral'}
                                {routine.period === 'SEMIANNUAL' && 'Semestral'}
                                {routine.period === 'ANNUAL' && 'Anual'}
                                {!routine.period && 'Recorrente'}
                            </span>
                            {isCompleted && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-success/10 text-success">
                                    Concluída ✓
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-lg leading-tight text-text-primary">{routine.name}</h3>
                        {routine.description && (
                            <p className="text-sm mt-1 text-text-secondary">{routine.description}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full pt-3 border-t border-border-card flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 shrink-0">
                    <p className="text-sm text-text-secondary">Tarefas: {routine.routineTasks?.length || 0}</p>
                    <div className="flex items-center gap-1.5 font-bold text-warning whitespace-nowrap text-xs">
                        <LuCoins size={14} />
                        <span>
                            {routine.routineTasks?.reduce((sum, rt) => sum + (rt.task?.generatedPoints || 0), 0) || 0} pts totais
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto flex-1 justify-end min-w-[200px]">
                    <Button
                        icon={<LuTrash2 />}
                        text="Excluir"
                        variant="cancel"
                        className="flex-1 min-w-[100px]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsConfirmDeleteOpen(true);
                        }}
                    />
                    <Button
                        icon={<LuPencil />}
                        text="Editar"
                        variant="secondary"
                        className="flex-1 min-w-[100px]"
                        onClick={handleEditRoutine}
                    />
                </div>
            </div>
        </div>
    );
}
