import { Reward } from "@/types/reward";
import { LuCoins } from "react-icons/lu";
import * as RewardService from "@/services/reward.service";
import toast from "react-hot-toast";

export default function RewardCard({ reward }: { reward: Reward }) {
    const handleRedeemReward = () => {
        try {
            const response = RewardService.redeemReward(reward.id as string);
        } catch (error: any) {
            toast.error("Erro ao resgatar recompensa");
            console.log(error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao realizar cadastro");
        };
    };

    return (
        <div className={`flex flex-col h-full gap-3 rounded-xl p-5 border transition-all ${reward.isActive ? 'bg-bg-card border-border-card hover:border-accent hover:shadow-md' : 'bg-bg-main border-border-card'}`}>
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <h3 className={`font-semibold text-lg leading-tight ${reward.isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{reward.title}</h3>
                        <p className={`text-sm mt-1 ${reward.isActive ? 'text-text-secondary' : 'text-text-secondary/60'}`}>{reward.description}</p>
                    </div>
                </div>
                {reward.icon && (
                    <div className={reward.isActive ? 'text-accent' : 'text-text-secondary/40'}>
                        {reward.icon}
                    </div>
                )}
            </div>
            
            <div className="mt-auto w-full pt-3 border-t border-border-card flex flex-row items-center justify-between">
                <div className={`flex items-center gap-1.5 font-bold ${reward.isActive ? 'text-warning' : 'text-text-secondary/50'}`}>
                    <LuCoins size={18} />
                    <span>{reward.pointsToGet} pts</span>
                </div>

                <button
                    disabled={!reward.isActive}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${reward.isActive ? 'bg-accent/10 text-accent hover:bg-accent hover:text-white' : 'bg-hover-sidebar text-text-secondary cursor-not-allowed'}`}
                >
                    Resgatar
                </button>
            </div>
        </div>
    );
}