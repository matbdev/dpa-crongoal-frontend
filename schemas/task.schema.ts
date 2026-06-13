import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, "É obrigatório informar um título com pelo menos 1 caractere"),
    description: z.string().optional(),
    type: z.enum(["UNIQUE", "RECURRENT"]),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    generatedPoints: z.coerce.number().int().min(1, "É obrigatório informar um custo com pelo menos 1 ponto"),
    columnId: z.uuid().optional()
});

export const updateTaskSchema = z.object({
    ...createTaskSchema.partial(),
    id: z.uuid().min(1, "É obrigatório informar o id da tarefa")
});

export const moveToColumnSchema = z.object({
    id: z.uuid().min(1, "É obrigatório informar o id da tarefa"),
    newColumnId: z.uuid().min(1, "É obrigatório informar o id da nova coluna")
});

export const createDailyRegisterSchema = z.object({
    taskId: z.uuid().min(1, "É obrigatório informar o id da tarefa"),
    isDone: z.boolean().optional(),
    obs: z.string().optional()
});

export const getTaskByIdSchema = z.object({
    id: z.uuid().min(1, "É obrigatório informar o id da tarefa")
});