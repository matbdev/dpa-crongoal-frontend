import Button from "./Button";
import { LuTriangleAlert } from "react-icons/lu";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
}

export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar Exclusão",
    description = "Tem certeza que deseja apagar",
    itemName
}: ConfirmDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <div
                className="bg-bg-main w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border-card"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-cancel">
                        <div className="p-3 bg-cancel/10 rounded-full">
                            <LuTriangleAlert size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                    </div>
                    <p className="text-text-secondary">
                        {description} {itemName ? <span className="font-semibold text-text-primary">"{itemName}"</span> : "este item"}? Esta ação não poderá ser desfeita.
                    </p>
                </div>
                <div className="p-4 bg-bg-card border-t border-border-card flex flex-col sm:flex-row justify-end gap-3">
                    <Button variant="secondary" text="Cancelar" onClick={onClose} className="w-full sm:w-auto" />
                    <Button variant="cancel" text="Sim, apagar" onClick={(e) => {
                        e.stopPropagation();
                        onConfirm();
                        onClose();
                    }} className="w-full sm:w-auto" />
                </div>
            </div>
        </div>
    );
}
