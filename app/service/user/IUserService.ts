import { Response } from "~/data/entity/Response";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { UserService } from "./UserService";
import { FetchClient } from "../FetchClient.server";

export class IUserService implements UserService {
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