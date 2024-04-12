import { AxiosResponse } from "axios";
import { LoginRequest } from "~/data/dto/auth/LoginRequest";
import { Response } from "~/data/entity/Response";
import { LoginResponse } from "~/data/entity/auth/LoginResponse";
import { HttpClient } from "~/service/HttpClient";

export class AuthService extends HttpClient {
    public async login({email, password}: LoginRequest): Promise<Response<LoginResponse>> {
        const instance = this.createInstance();
        const res = instance.post<Response<LoginResponse>>(`/auth/login`, {email: email, password: password})
        return (await res).data
    }
}