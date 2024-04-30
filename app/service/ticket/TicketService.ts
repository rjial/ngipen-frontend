import { TiketVerificationPayloadRequest } from "~/data/dto/ticket/TiketVerificationPayloadRequest";
import { Response } from "~/data/entity/Response";
import { Page } from "~/data/entity/common/Page";
import { Tiket } from "~/data/entity/ticket/Tiket";

export interface TicketService {
    getTickets(data: {page: number, size: number, request: Request}): Promise<Response<Page<Tiket>>>
    getTiket(data: {uuid: string, request: Request}): Promise<Response<Tiket>>
    generateTiketQR(uuid: string, request: Request): Promise<Blob>
    scanTiketQR(data: TiketVerificationPayloadRequest, request: Request): Promise<Response<Tiket>>
}