import { z } from "zod";
import { Level } from "~/data/entity/user/Level";

export interface UserCreatedRequest {
    email: string;
    name: string;
    hp: string;
    address: string;
    level: string;
    password: string;
}

export const UserCreatedRequestValidation = z.object({
    email: z.string().email(),
    name: z.string(),
    nohp: z.string(),
    address: z.string(),
    level: z.nativeEnum(Level),
    password: z.string(),
})