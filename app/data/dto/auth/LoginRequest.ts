import { z } from "zod";

export class LoginRequest {
    email: string
    password: string
    
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

export const LoginRequestValidation = z.object({
    email: z.string(),
    password: z.string().min(8, "Minimal ukuran password adalah 8")
})