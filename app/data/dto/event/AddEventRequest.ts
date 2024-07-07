import { z } from "zod";
// import { File } from "buffer"

export interface AddEventRequest {
    name: string;
    tanggalAwal: string;
    tanggalAkhir: string;
    waktuAwal: string;
    waktuAkhir: string;
    lokasi: string;
    desc: string;
    headerImageUrl: File | undefined;
    itemImageUrl: File | undefined;
}

// const fileSchema = z.instanceof(File, { message: "Required" });
// const imageSchema = fileSchema.refine(
//     (file) => file.size == 0 || file.type.startsWith("image/")
// )

export const AddEventRequestValidation = z.object({
    name: z.string().refine((value) => value !== ''),
    tanggalAwal: z.string().refine((value) => value !== ''),
    tanggalAkhir: z.string().refine((value) => value !== ''),
    waktuAwal: z.string().refine((value) => value !== ''),
    waktuAkhir: z.string().refine((value) => value !== ''),
    lokasi: z.string().refine((value) => value !== ''),
    desc: z.string().refine((value) => value !== ''),
    // headerImageUrl: imageSchema.refine((file) => file.size > 0, "File size was 0, please upload a proper file!"),
    // itemImageUrl: imageSchema.refine((file) => file.size > 0, "File size was 0, please upload a proper file!"),
})