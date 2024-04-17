import { LoginRequest } from "~/data/dto/auth/LoginRequest";
import { LoginResponse } from "~/data/dto/auth/LoginResponse";
import { RegisterRequest } from "~/data/dto/auth/RegisterRequest";
import { RegisterResponse } from "~/data/dto/auth/RegisterResponse";
import { Response } from "~/data/entity/Response";

export interface AuthService {
    login(data: LoginRequest): Promise<Response<LoginResponse>>
    register(data: RegisterRequest): Promise<Response<RegisterResponse>>
}