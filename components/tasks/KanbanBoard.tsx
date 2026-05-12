import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
    tasks: Task[];
    onUpdateTask: (updatedTask: Task) => void;
    onDeleteTask: (deletedId: string) => void;
    onCompleteTask: (taskId: string) => void;
}

export default function KanbanBoard({ tasks, onUpdateTask, onDeleteTask, onCompleteTask }: KanbanBoardProps) {
    // For now, as requested, all tasks go to the first column
    const columns = [
        { id: "todo", title: "A Fazer", tasks: tasks },
        { id: "in_progress", title: "Em Andamento", tasks: [] },
        { id: "done", title: "Concluído", tasks: [] },
    ];

    return (
        <div className="flex h-full gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
                <div key={column.id} className="shrink-0 w-[350px] bg-bg-card border border-border-card rounded-xl flex flex-col overflow-hidden">
                    {/* Column Header */}
                    <div className="p-4 border-b border-border-card bg-bg-main/50 flex justify-between items-center">
                        <h3 className="font-semibold text-text-primary">{column.title}</h3>
                        <span className="bg-bg-main px-2 py-0.5 rounded-full text-xs font-bold text-text-secondary border border-border-card">
                            {column.tasks.length}
                        </span>
                    </div>

                    {/* Column Content */}
                    <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4 min-h-[200px]">
                        {column.tasks.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-text-secondary/50 text-sm italic">
                                Nenhuma tarefa
                            </div>
                        ) : (
                            column.tasks.map(task => (
                                <TaskCard
                                    key={task.id || task.title}
                                    task={task}
                                    onUpdate={onUpdateTask}
                                    onDelete={onDeleteTask}
                                    onComplete={onCompleteTask}
                                />
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
