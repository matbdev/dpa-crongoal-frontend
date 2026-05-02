interface StepsOfWorkingProps {
    step: number;
    title: string;
    description: string;
}

export default function StepsOfWorking({ step, title, description }: StepsOfWorkingProps) {
    return (
        <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white text-xl font-bold shadow-lg shadow-accent/25">
                {step}
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
                {description}
            </p>
        </div>
    );
}


