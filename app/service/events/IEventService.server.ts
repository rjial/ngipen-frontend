import { Response } from "~/data/entity/Response";
import { Event } from "~/data/entity/events/Event";
import { EventService } from "./EventService";
import { AxiosInstance } from "axios";
import { HttpClient } from "../HttpClient";
import { FetchClient } from "../FetchClient.server";
import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { Page } from "~/data/entity/common/Page";
import { AddJenisTiketRequest } from "~/data/dto/event/AddJenisTiketRequest";
import { Tiket } from "~/data/entity/ticket/Tiket";
import { AddEventRequest } from "~/data/dto/event/AddEventRequest";

export class IEventService implements EventService {
    insertEvent(data: AddEventRequest, request: Request): Promise<Response<Event>> {
        const fetchClient = new FetchClient()
        return fetchClient.post<Event, AddEventRequest>("/event", data, request)
    }
    getTiketsByPemegangAcara(uuidEvent: string, page: number, size: number, request: Request): Promise<Response<Page<Tiket>>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Page<Tiket>>(`/event/${uuidEvent}/tiket?page=${page}&size=${size}`, request)
    }
    getMyEvents(page: number, size: number, request: Request): Promise<Response<Page<Event>>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Page<Event>>(`/event/myevents?page=${page}&size=${size}`, request)
    }
    async getJenisTiketDetail(uuid: string, id: number, request?: Request | undefined): Promise<Response<JenisTiket>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<JenisTiket>(`/event/${uuid}/jenistiket/${id}`, request)
    }
    async updateJenisTiket(data: AddJenisTiketRequest, uuid: string, id: number, request: Request): Promise<Response<JenisTiket>> {
        const fetchClient = new FetchClient()
        return fetchClient.put<JenisTiket, AddJenisTiketRequest>(`/event/${uuid}/jenistiket/${id}`, data, request)
    }
    deleteJenisTiket(id: number, uuid: string, request: Request): Promise<Response<string>> {
        const fetchClient = new FetchClient()
        return fetchClient.delete<string, string>(`/event/${uuid}/jenistiket/${id}`, "", request)
    }
    insertJenisTiket(data: AddJenisTiketRequest, uuid: string, request: Request): Promise<Response<JenisTiket>> {
        const fetchClient = new FetchClient()
        return fetchClient.post<JenisTiket, AddJenisTiketRequest>(`/event/${uuid}/jenistiket`, data, request)
    }
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