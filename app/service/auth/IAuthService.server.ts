import { AxiosResponse } from "axios";
import { LoginRequest } from "~/data/dto/auth/LoginRequest";
import { Response } from "~/data/entity/Response";
import { LoginResponse } from "~/data/dto/auth/LoginResponse";
import { HttpClient } from "~/service/HttpClient";
import { FetchClient } from "../FetchClient.server";
import { AuthService } from "./AuthService";
import { RegisterRequest } from "~/data/dto/auth/RegisterRequest";
import { RegisterResponse } from "~/data/dto/auth/RegisterResponse";
import {Authenticator} from "remix-auth"
import { User } from "~/data/entity/auth/User";
import { sessionStorage } from "~/sessions";
import { FormStrategy } from "remix-auth-form";
import { UserClaim } from "~/data/entity/auth/UserClaim";
import {jwtDecode} from "jwt-decode"

export class IAuthService implements AuthService {
    public async register(data: RegisterRequest): Promise<Response<RegisterResponse>> {
        const fetchClient = new FetchClient()
        return fetchClient.post<RegisterResponse, RegisterRequest>("/auth/register", data)
    }
    public async login(data: LoginRequest): Promise<Response<LoginResponse>> {
        const fetchClient = new FetchClient()
        return fetchClient.post<LoginResponse, LoginRequest>("/auth/login", data)
    }
}