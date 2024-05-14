import { Response } from "~/data/entity/Response";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { UserService } from "./UserService";
import { FetchClient } from "../FetchClient.server";
import { UserCreatedRequest } from "~/data/dto/user/UserCreatedRequest";
import { UserCreatedResponse } from "~/data/dto/user/UserCreatedResponse";
import { UserUpdatedRequest } from "~/data/dto/user/UserUpdatedRequest";

export class IUserService implements UserService {
    editUser(data: { data: UserCreatedRequest; uuid: string; }, request: Request): Promise<Response<UserCreatedResponse>> {
        const fetchClient = new FetchClient()
        return fetchClient.patch<UserCreatedResponse, UserUpdatedRequest>(`/user/${data.uuid}`, data.data, request)
    }
    addUser(data: UserCreatedRequest, request: Request): Promise<Response<UserCreatedResponse>> {
        const fetchClient = new FetchClient()
        return fetchClient.post<UserCreatedResponse, UserCreatedRequest>(`/user`, data, request)
    }
    deleteUser(data: { uuid: string; request: Request; }): Promise<Response<string>> {
        const fetchClient = new FetchClient()
        return fetchClient.delete<string, {uuid: string}>(`/user/${data.uuid}`, {uuid: data.uuid}, data.request)
    }
    getUsers(data: {page: number, size: number, request: Request; }): Promise<Response<Page<UserItem>>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Page<UserItem>>(`/user?page=${data.page}&size=${data.size}`, data.request)
    }
    getUser(data: { uuid: string; request: Request; }): Promise<Response<UserItem>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<UserItem>(`/user/${data.uuid}`, data.request)
    }
    
}