import { LuList } from "react-icons/lu";

interface CustomEmptyListProps {
    text?: string;
    secondaryText?: string;
}

export default function CustomEmptyList({ text = "Nenhum item encontrado", secondaryText = "Cadastre um novo item para começar" }: CustomEmptyListProps) {
    return (
        <div className="flex flex-col gap-3 items-center justify-center bg-danger/50 rounded-xl p-5 border border-danger/20">
            <div className="bg-white rounded-full p-2">
                <LuList size={40} color="var(--color-danger)" />
            </div>
            <div className="flex flex-col items-center">
                <p className="text-text-secondary font-semibold">{text}</p>
                <p className="text-text-secondary font-light text-sm">{secondaryText}</p>
            </div>
        </div>
    )
}