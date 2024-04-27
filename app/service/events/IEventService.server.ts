import { Response } from "~/data/entity/Response";
import { Event } from "~/data/entity/events/Event";
import { EventService } from "./EventService";
import { AxiosInstance } from "axios";
import { HttpClient } from "../HttpClient";
import { FetchClient } from "../FetchClient.server";
import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { Page } from "~/data/entity/common/Page";

export class IEventService implements EventService {
    async getJenisTiket(uuid: string): Promise<Response<JenisTiket[]>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<JenisTiket[]>(`/event/${uuid}/jenistiket`)
    }
    async getEvents(page: number, size: number, request: Request): Promise<Response<Page<Event>>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Page<Event>>(`/event?page=${page}&size=${size}`, request)
    }
    async getEvent(uuid: string, request?: Request): Promise<Response<Event>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Event>(`/event/${uuid}`, request)
    }

}