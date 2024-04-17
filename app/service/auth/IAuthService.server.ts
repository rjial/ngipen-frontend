import { AxiosResponse } from "axios";
import { LoginRequest } from "~/data/dto/auth/LoginRequest";
import { Response } from "~/data/entity/Response";
import { LoginResponse } from "~/data/dto/auth/LoginResponse";
import { HttpClient } from "~/service/HttpClient";
import { FetchClient } from "../FetchClient.server";

export class IAuthService {
    public async login(email: string, password: string): Promise<Response<LoginResponse>> {
        const {post} = new FetchClient()
        return post<Response<LoginResponse>, LoginRequest>("/auth/login", {email: email, password: password})
    }
}