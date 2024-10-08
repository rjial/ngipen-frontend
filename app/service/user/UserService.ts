import { UserCreatedRequest } from "~/data/dto/user/UserCreatedRequest";
import { UserCreatedResponse } from "~/data/dto/user/UserCreatedResponse";
import { Response } from "~/data/entity/Response";
import { User, UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";

export interface UserService {
    getUsers(data: {page: number, size: number, request: Request}): Promise<Response<Page<UserItem>>>
    getUser(data: {uuid: string, request: Request}): Promise<Response<UserItem>>
    deleteUser(data: {uuid: string, request: Request}): Promise<Response<string>>
    addUser(data: UserCreatedRequest, request: Request): Promise<Response<UserCreatedResponse>>
    editUser(data: {data: UserCreatedRequest, uuid: string}, request: Request): Promise<Response<UserCreatedResponse>>
}