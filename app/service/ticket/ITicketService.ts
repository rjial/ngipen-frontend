import { Response } from "~/data/entity/Response";
import { Page } from "~/data/entity/common/Page";
import { TiketItemListResponse } from "~/data/dto/ticket/TiketItemListResponse";
import {TicketService} from "./TicketService"
import { FetchClient } from "../FetchClient.server";
import { TiketVerificationPayloadRequest } from "~/data/dto/ticket/TiketVerificationPayloadRequest";
import { Tiket } from "~/data/entity/ticket/Tiket";
import { UserItem } from "~/data/entity/auth/User";

export class ITicketService implements TicketService {
    getUserFromTiket(data: { uuid: string; }, request: Request): Promise<Response<UserItem>> {
        const fetchClient = new FetchClient();
        return fetchClient.get<UserItem>(`/tiket/${data.uuid}/user`, request)
    }
    verifyTiketByUUID(data: { uuid: string; status: boolean; request: Request }): Promise<Response<Tiket>> {
        const fetchClient = new FetchClient();
        return fetchClient.get<Tiket>(`/tiket/verify/${data.uuid}?status=${data.status ? 1 : 0}`, data.request)
    }
    scanTiketQR(data: TiketVerificationPayloadRequest, request: Request): Promise<Response<TiketItemListResponse>> {
        const fetchClient = new FetchClient();
        return fetchClient.post<TiketItemListResponse, TiketVerificationPayloadRequest>("/tiket/verify", data, request)
    }
    generateTiketQR(uuid: string, request: Request): Promise<Blob> {
        const fetchClient = new FetchClient();
        return fetchClient.getBlob(`/tiket/${uuid}/qr`, request)
    }
    getTiket(data: { uuid: string; request: Request; }): Promise<Response<TiketItemListResponse>> {
        const fetchClient = new FetchClient();
        return fetchClient.get<TiketItemListResponse>(`/tiket/${data.uuid}`, data.request)
    }
    getTickets(data: { page: number, size: number, request: Request; }): Promise<Response<Page<TiketItemListResponse>>> {
        const fetchClient = new FetchClient();
        return fetchClient.get<Page<TiketItemListResponse>>(`/tiket?page=${data.page}&size=${data.size}`, data.request)
    }

}