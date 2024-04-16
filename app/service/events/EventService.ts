import { Response } from "~/data/entity/Response";
import { Event } from "~/data/entity/events/Event";

export interface EventService {
    getEvents(): Promise<Response<Event[]>>
    getEvent(uuid: string): Promise<Response<Event>>
}