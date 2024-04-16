import { Response } from "~/data/entity/Response";
import { Event } from "~/data/entity/events/Event";
import { EventService } from "./EventService";
import { AxiosInstance } from "axios";
import { HttpClient } from "../HttpClient";
import { FetchClient } from "../FetchClient";

export class IEventService implements EventService {
    async getEvents(): Promise<Response<Event[]>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Response<Event[]>>("/event")
    }
    async getEvent(uuid: string): Promise<Response<Event>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Response<Event>>(`/event/${uuid}`)
    }

}