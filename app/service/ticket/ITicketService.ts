import { Response } from "~/data/entity/Response";
import { Page } from "~/data/entity/common/Page";
import { Tiket } from "~/data/entity/ticket/Tiket";
import {TicketService} from "./TicketService"
import { FetchClient } from "../FetchClient.server";

export class ITicketService implements TicketService {
    getTickets(data: { page: number, size: number, request: Request; }): Promise<Response<Page<Tiket>>> {
        const fetchClient = new FetchClient();
        return fetchClient.get<Page<Tiket>>(`/tiket?page=${data.page}&size=${data.size}`, data.request)
    }

}