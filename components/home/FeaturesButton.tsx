import { IconType } from "react-icons";

type FeaturesButtonProps = {
    icon: IconType;
    color: string;
    title: string;
    description: string;
}

export default function FeaturesButton({ icon: Icon, color, title, description }: FeaturesButtonProps) {
    return (
        <div className={`group flex flex-col gap-4 rounded-2xl border border-border-card bg-bg-card p-6 transition-all hover:border-${color}/40 hover:shadow-lg hover:-translate-y-1`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${color}/10`}>
                <Icon size={24} className={`text-${color}`} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
                {description}
            </p>
        </div>
    );
}

