import { Response } from "~/data/entity/Response";
import { Event } from "~/data/entity/events/Event";
import { JenisTiket } from "~/data/entity/events/JenisTiket";

export interface EventService {
    getEvents(): Promise<Response<Event[]>>
    getEvent(uuid: string): Promise<Response<Event>>
    getJenisTiket(uuid: string): Promise<Response<JenisTiket[]>>
}