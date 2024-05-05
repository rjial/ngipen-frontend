import { LoginRequest } from "~/data/dto/auth/LoginRequest";
import { LoginResponse } from "~/data/dto/auth/LoginResponse";
import { RefreshTokenRequest } from "~/data/dto/auth/RefreshTokenRequest";
import { RefreshTokenResponse } from "~/data/dto/auth/RefreshTokenResponse";
import { RegisterRequest } from "~/data/dto/auth/RegisterRequest";
import { RegisterResponse } from "~/data/dto/auth/RegisterResponse";
import { Response } from "~/data/entity/Response";
import { UserItem } from "~/data/entity/auth/User";

export interface AuthService {
    login(data: LoginRequest): Promise<Response<LoginResponse>>
    register(data: RegisterRequest): Promise<Response<RegisterResponse>>
    detail(request: Request): Promise<Response<UserItem>>
    refresh(data: RefreshTokenRequest, request: Request): Promise<Response<RefreshTokenResponse>>
}