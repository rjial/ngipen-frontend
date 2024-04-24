import { Response } from "~/data/entity/Response";
import { Page } from "~/data/entity/common/Page";
import { Tiket } from "~/data/entity/ticket/Tiket";

export interface TicketService {
    getTickets(data: {page: number, size: number, request: Request}): Promise<Response<Page<Tiket>>>
}