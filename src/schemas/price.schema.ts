import { z } from "zod"

export const priceSchema = z.object({
    value: z.number().positive(),
    oldValue: z.number().positive().nullable(),
    currency: z.literal("BRL"),
})

export type Price = z.infer<typeof priceSchema>
