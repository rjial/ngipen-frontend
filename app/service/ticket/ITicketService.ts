import { Response } from "~/data/entity/Response";
import { Page } from "~/data/entity/common/Page";
import { Tiket } from "~/data/entity/ticket/Tiket";
import {TicketService} from "./TicketService"
import { FetchClient } from "../FetchClient.server";
import { TiketVerificationPayloadRequest } from "~/data/dto/ticket/TiketVerificationPayloadRequest";

export class ITicketService implements TicketService {
    scanTiketQR(data: TiketVerificationPayloadRequest, request: Request): Promise<Response<Tiket>> {
        const fetchClient = new FetchClient();
        return fetchClient.post<Tiket, TiketVerificationPayloadRequest>("/tiket/verify", data, request)
    }
    generateTiketQR(uuid: string, request: Request): Promise<Blob> {
        const fetchClient = new FetchClient();
        return fetchClient.getBlob(`/tiket/${uuid}/qr`, request)
    }
    getTiket(data: { uuid: string; request: Request; }): Promise<Response<Tiket>> {
        const fetchClient = new FetchClient();
        return fetchClient.get<Tiket>(`/tiket/${data.uuid}`, data.request)
    }
    getTickets(data: { page: number, size: number, request: Request; }): Promise<Response<Page<Tiket>>> {
        const fetchClient = new FetchClient();
        return fetchClient.get<Page<Tiket>>(`/tiket?page=${data.page}&size=${data.size}`, data.request)
    }

}