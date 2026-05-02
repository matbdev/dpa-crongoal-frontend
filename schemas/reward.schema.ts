import { z } from 'zod';

export const createRewardSchema = z.object({
    title: z.string().min(3, "É obrigatório informar um título com pelo menos 3 caracteres"),
    description: z.string().optional(),
    pointsToGet: z.coerce.number({ message: "Insira um número válido" }).int().min(1, "É obrigatório informar um custo com pelo menos 1 ponto"),
    icon: z.string().optional()
});

export const updateRewardSchema = createRewardSchema.partial();

export const getRewardByIdSchema = z.object({
    id: z.uuid().min(1, "É obrigatório informar o id da recompensa")
});

export const redeemRewardSchema = z.object({
    spentPoints: z.coerce.number({ message: "Insira um número válido" }).int().min(1, "É obrigatório informar um custo com pelo menos 1 ponto")
});