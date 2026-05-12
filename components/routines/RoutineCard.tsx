import { Routine } from "@/types/routine";
import { LuPencil, LuTrash2, LuRepeat } from "react-icons/lu";
import * as RoutineService from "@/services/routine.service";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { useState } from "react";
import AddEditRoutinePopUp from "./AddEditRoutinePopUp";

interface RoutineCardProps {
    routine: Routine;
    onUpdate?: (updatedRoutine: Routine) => void;
    onDelete?: (deletedId: string) => void;
}

export default function RoutineCard({ routine, onUpdate, onDelete }: RoutineCardProps) {
    const [isPopUpEditOpen, setIsPopUpEditOpen] = useState(false);

    const handleUpdateRoutine = (updatedRoutine: Routine) => {
        if (onUpdate) onUpdate(updatedRoutine);
    };

    const handleEditRoutine = () => {
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

    return (
        <div className="flex flex-col gap-3 rounded-xl p-5 border transition-all bg-bg-card border-border-card hover:border-accent hover:shadow-md">
            {isPopUpEditOpen && <AddEditRoutinePopUp
                onClose={() => { setIsPopUpEditOpen(false) }}
                onSuccess={(updatedRoutine: Routine) => {
                    setIsPopUpEditOpen(false);
                    handleUpdateRoutine(updatedRoutine);
                }}
                routine={routine}
            />}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                                <LuRepeat className="inline mr-1" size={12} />
                                Recorrente
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg leading-tight text-text-primary">{routine.name}</h3>
                        {routine.description && (
                            <p className="text-sm mt-1 text-text-secondary">{routine.description}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full pt-3 border-t border-border-card flex flex-row items-center justify-between gap-2">
                <div>
                    <p className="text-sm mt-1 text-text-secondary">Tarefas: {routine.routineTasks?.length || 0}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <Button
                        icon={<LuTrash2 />}
                        text="Excluir"
                        variant="cancel"
                        onClick={handleDeleteRoutine}
                    />
                    <Button
                        icon={<LuPencil />}
                        text="Editar"
                        variant="secondary"
                        onClick={handleEditRoutine}
                    />
                </div>
            </div>
        </div>
    );
}
