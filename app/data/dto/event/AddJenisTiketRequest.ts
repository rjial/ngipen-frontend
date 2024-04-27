import { z } from "zod"

export type AddJenisTiketRequest = {
    name: string
    harga: number
}

export const AddJenisTiketRequestValidation = z.object({
    name: z.string(),
    harga: z.number()
})