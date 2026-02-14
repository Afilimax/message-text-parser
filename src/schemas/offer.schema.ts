import { z } from "zod"

import { priceSchema } from "./price.schema"

export const offerSchema = z.object({
    title: z.string().min(3),
    price: priceSchema,
    url: z.url(),
    coupons: z.array(z.string()).nullable(),
})

export type Offer = z.infer<typeof offerSchema>
