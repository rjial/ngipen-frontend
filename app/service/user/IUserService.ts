import { Response } from "~/data/entity/Response";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { UserService } from "./UserService";
import { FetchClient } from "../FetchClient.server";

export class IUserService implements UserService {
    getUsers(data: {page: number, size: number, request: Request; }): Promise<Response<Page<UserItem>>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Page<UserItem>>(`/user?page=${data.page}&size=${data.size}`, data.request)
    }
    getUser(data: { uuid: string; request: Request; }): Promise<Response<UserItem>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<UserItem>(`/user/${data.uuid}`, data.request)
    }
    
}