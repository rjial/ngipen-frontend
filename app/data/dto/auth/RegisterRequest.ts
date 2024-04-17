import { z } from "zod";

export interface RegisterRequest {
    name:     string;
    email:    string;
    password: string;
    hp:       string;
    address:  string;
}

export const RegisterRequestValidation = z.object({
    name:     z.string(),
    email:    z.string().email(),
    password: z.string().min(8, "Minimal passsword adalah 8"),
    hp:       z.string(),
    address:  z.string(),
})
