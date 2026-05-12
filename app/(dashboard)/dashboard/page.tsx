"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { getTaskCount, getDailyTasks } from "@/services/task.service";
import { getProjectCount, getProjects } from "@/services/project.service";
import { getRoutineCount } from "@/services/routine.service";
import { getRewardCount, getAllRedeems } from "@/services/reward.service";
import { getProfile } from "@/services/user.service";
import { Project } from "@/types/project";
import { DailyRegister } from "@/types/task";
import { User } from "@/types/user";
import { LuSquareCheck, LuFolderOpen, LuRepeat, LuGift, LuCoins, LuTicket, LuCalendarClock, LuClipboardCheck, LuFlame, LuChartBar } from "react-icons/lu";
import { usePoints } from "@/contexts/PointsContext";

// Helper: greeting based on time of day
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
}

// Helper: get last 7 days labels (short weekday)
function getLast7DaysLabels(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""));
    }
    return days;
}

// Helper: count completions per day for the last 7 days
function getWeeklyCompletions(dailyTasks: DailyRegister[]): number[] {
    const counts: number[] = new Array(7).fill(0);
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(now.getDate() - i);
        const dayStr = day.toISOString().slice(0, 10); // YYYY-MM-DD

        counts[6 - i] = dailyTasks.filter(r => {
            if (!r.registerDate || !r.isDone) return false;
            return new Date(r.registerDate).toISOString().slice(0, 10) === dayStr;
        }).length;
    }

    return counts;
}

// Helper: count today's completions
function getTodayProgress(dailyTasks: DailyRegister[]): { done: number; total: number } {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayTasks = dailyTasks.filter(r => {
        if (!r.registerDate) return false;
        return new Date(r.registerDate).toISOString().slice(0, 10) === todayStr;
    });
    return {
        total: todayTasks.length,
        done: todayTasks.filter(r => r.isDone).length,
    };
}

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [counts, setCounts] = useState({
        tasks: 0,
        projects: 0,
        routines: 0,
        rewards: 0,
        redeems: 0
    });
    const { points } = usePoints();
    const [userName, setUserName] = useState("");
    const [upcomingProjects, setUpcomingProjects] = useState<Project[]>([]);
    const [recentDaily, setRecentDaily] = useState<DailyRegister[]>([]);
    const [todayProgress, setTodayProgress] = useState({ done: 0, total: 0 });
    const [weeklyData, setWeeklyData] = useState<number[]>(new Array(7).fill(0));
    const [isLoading, setIsLoading] = useState(true);

    // Handle Google OAuth callback: extract token from URL and save to localStorage
    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        if (accessToken) {
            localStorage.setItem("token", accessToken);
            // Clean the URL to remove the token from the address bar / browser history
            router.replace("/dashboard");
        }
    }, [searchParams, router]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [tasks, projects, routines, rewards, redeems, profile, allProjects, dailyTasks] = await Promise.all([
                    getTaskCount(),
                    getProjectCount(),
                    getRoutineCount(),
                    getRewardCount(),
                    getAllRedeems(),
                    getProfile(),
                    getProjects(),
                    getDailyTasks()
                ]);

                setCounts({
                    tasks,
                    projects,
                    routines,
                    rewards,
                    redeems: redeems.length
                });

                setUserName(profile.displayName || profile.fullName || "");

                // Sort projects by limitDate (nearest first), only future ones
                const now = new Date();
                const upcoming = allProjects
                    .filter(p => new Date(p.limitDate) > now)
                    .sort((a, b) => new Date(a.limitDate).getTime() - new Date(b.limitDate).getTime())
                    .slice(0, 4);
                setUpcomingProjects(upcoming);

                // Most recent daily registers (last 5)
                const sorted = [...dailyTasks]
                    .sort((a, b) => new Date(b.registerDate ?? 0).getTime() - new Date(a.registerDate ?? 0).getTime())
                    .slice(0, 5);
                setRecentDaily(sorted);

                // Today's progress
                setTodayProgress(getTodayProgress(dailyTasks));

                // Weekly chart data
                setWeeklyData(getWeeklyCompletions(dailyTasks));

            } catch (error) {
                console.error("Failed to fetch dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    };

    const daysUntil = (dateStr: string) => {
        const now = new Date();
        const target = new Date(dateStr);
        const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const weekLabels = getLast7DaysLabels();
    const maxWeekly = Math.max(...weeklyData, 1);
    const todayPercent = todayProgress.total > 0 ? Math.round((todayProgress.done / todayProgress.total) * 100) : 0;

    return (
        <div className="p-8 flex flex-col gap-8">
            {/* Header with personalized greeting */}
            <div>
                {isLoading ? (
                    <div className="h-8 w-64 rounded-lg bg-bg-card animate-pulse"></div>
                ) : (
                    <h1 className="text-2xl font-bold text-text-primary">
                        {getGreeting()}{userName ? `, ${userName.split(" ")[0]}` : ""}!
                    </h1>
                )}
                <p className="text-text-secondary mt-1">Aqui está o resumo das suas atividades.</p>
            </div>

            {/* Summary Cards */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-32 rounded-2xl bg-bg-card animate-pulse border border-border-card"></div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <DashboardCard
                            title="Saldo de Pontos"
                            value={points !== null ? points : "..."}
                            icon={<LuCoins size={24} className="text-warning" />}
                            colorClass="bg-warning/10"
                        />
                        <DashboardCard
                            title="Total de Tarefas"
                            value={counts.tasks}
                            icon={<LuSquareCheck size={24} className="text-success" />}
                            colorClass="bg-success/10"
                            href="/tasks"
                        />
                        <DashboardCard
                            title="Projetos Ativos"
                            value={counts.projects}
                            icon={<LuFolderOpen size={24} className="text-accent" />}
                            colorClass="bg-accent/10"
                            href="/projects"
                        />
                        <DashboardCard
                            title="Rotinas Criadas"
                            value={counts.routines}
                            icon={<LuRepeat size={24} className="text-secondary" />}
                            colorClass="bg-secondary/10"
                            href="/routines"
                        />
                        <DashboardCard
                            title="Recompensas"
                            value={counts.rewards}
                            icon={<LuGift size={24} className="text-danger" />}
                            colorClass="bg-danger/10"
                            href="/rewards"
                        />
                        <DashboardCard
                            title="Resgates Feitos"
                            value={counts.redeems}
                            icon={<LuTicket size={24} className="text-surface" />}
                            colorClass="bg-surface/10"
                        />
                    </div>

                    {/* Today's Progress + Weekly Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Today's Progress */}
                        <div className="rounded-2xl border border-border-card bg-bg-card p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <LuFlame size={20} className="text-warning" />
                                <h2 className="text-lg font-semibold text-text-primary">Progresso de Hoje</h2>
                            </div>

                            {todayProgress.total === 0 ? (
                                <p className="text-sm text-text-secondary">Nenhuma tarefa registrada hoje.</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="text-4xl font-bold text-text-primary">{todayProgress.done}</span>
                                            <span className="text-lg text-text-secondary ml-1">/ {todayProgress.total}</span>
                                        </div>
                                        <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${todayPercent === 100 ? "bg-success/10 text-success" : todayPercent >= 50 ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"}`}>
                                            {todayPercent}%
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full h-3 rounded-full bg-bg-main overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${todayPercent === 100 ? "bg-success" : todayPercent >= 50 ? "bg-warning" : "bg-danger"}`}
                                            style={{ width: `${todayPercent}%` }}
                                        />
                                    </div>

                                    <p className="text-xs text-text-secondary">
                                        {todayPercent === 100
                                            ? "Parabéns! Você completou todas as tarefas de hoje! 🎉"
                                            : todayPercent >= 50
                                                ? "Bom progresso! Continue assim."
                                                : "Vamos lá! Ainda dá tempo de completar mais tarefas."}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Weekly Chart */}
                        <div className="rounded-2xl border border-border-card bg-bg-card p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <LuChartBar size={20} className="text-accent" />
                                <h2 className="text-lg font-semibold text-text-primary">Semana</h2>
                            </div>

                            <div className="flex items-end justify-between gap-2 h-36">
                                {weeklyData.map((count, i) => {
                                    const heightPercent = (count / maxWeekly) * 100;
                                    const isToday = i === 6;

                                    return (
                                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                            <span className="text-xs font-semibold text-text-primary">{count}</span>
                                            <div className="w-full flex items-end" style={{ height: "80px" }}>
                                                <div
                                                    className={`w-full rounded-md transition-all duration-500 ${isToday ? "bg-accent" : "bg-accent/30"}`}
                                                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs capitalize ${isToday ? "font-bold text-accent" : "text-text-secondary"}`}>
                                                {weekLabels[i]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Projects + Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upcoming Projects */}
                        <div className="rounded-2xl border border-border-card bg-bg-card p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <LuCalendarClock size={20} className="text-accent" />
                                <h2 className="text-lg font-semibold text-text-primary">Próximos Prazos</h2>
                            </div>

                            {upcomingProjects.length === 0 ? (
                                <p className="text-sm text-text-secondary">Nenhum projeto com prazo futuro.</p>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {upcomingProjects.map((project) => {
                                        const days = daysUntil(project.limitDate);
                                        const urgencyColor = days <= 3 ? "text-danger" : days <= 7 ? "text-warning" : "text-text-secondary";

                                        return (
                                            <li key={project.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-bg-main border border-border-card">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-text-primary">{project.title}</span>
                                                    <span className="text-xs text-text-secondary">{formatDate(project.limitDate)}</span>
                                                </div>
                                                <span className={`text-xs font-semibold ${urgencyColor}`}>
                                                    {days === 0 ? "Hoje!" : days === 1 ? "Amanhã" : `${days} dias`}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* Recent Daily Completions */}
                        <div className="rounded-2xl border border-border-card bg-bg-card p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <LuClipboardCheck size={20} className="text-success" />
                                <h2 className="text-lg font-semibold text-text-primary">Atividade Recente</h2>
                            </div>

                            {recentDaily.length === 0 ? (
                                <p className="text-sm text-text-secondary">Nenhum registro diário encontrado.</p>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {recentDaily.map((register) => (
                                        <li key={register.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-bg-main border border-border-card">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-text-primary">
                                                    {register.task?.title ?? "Tarefa"}
                                                </span>
                                                <span className="text-xs text-text-secondary">
                                                    {register.registerDate ? formatDate(register.registerDate) : "—"}
                                                </span>
                                            </div>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-md ${register.isDone ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                                                {register.isDone ? "Concluída" : "Pendente"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
