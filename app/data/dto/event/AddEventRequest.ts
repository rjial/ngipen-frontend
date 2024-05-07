import { z } from "zod";

export interface AddEventRequest {
    name: string;
    tanggalAwal: string;
    waktuAwal: string;
    waktuAkhir: string;
    lokasi: string;
    desc: string;
    persen: number;
}

export const AddEventRequestValidation = z.object({
    name: z.string().refine((value) => value !== ''),
    tanggalAwal: z.string().refine((value) => value !== ''),
    waktuAwal: z.string().refine((value) => value !== ''),
    waktuAkhir: z.string().refine((value) => value !== ''),
    lokasi: z.string().refine((value) => value !== ''),
    desc: z.string().refine((value) => value !== ''),
    persen: z.number(),
})