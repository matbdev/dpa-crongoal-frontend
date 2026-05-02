import { IconType } from "react-icons";

interface ValuesButtonProps {
    icon: IconType;
    color: string;
    title: string;
    description: string;
}

export default function ValuesButton({ icon: Icon, color, title, description }: ValuesButtonProps) {
    return (
        <div className="flex flex-col items-center text-center gap-3 p-6">
            <Icon size={32} className={`text-${color}`} />
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
                {description}
            </p>
        </div>
    );
}

