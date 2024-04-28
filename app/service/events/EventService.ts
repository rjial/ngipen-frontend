import { AddJenisTiketRequest } from "~/data/dto/event/AddJenisTiketRequest";
import { Response } from "~/data/entity/Response";
import { Page } from "~/data/entity/common/Page";
import { Event } from "~/data/entity/events/Event";
import { JenisTiket } from "~/data/entity/events/JenisTiket";

export interface EventService {
    getEvents(page: number, size: number, request: Request): Promise<Response<Page<Event>>>
    getEvent(uuid: string): Promise<Response<Event>>
    getJenisTiket(uuid: string, request?: Request): Promise<Response<JenisTiket[]>>
    getJenisTiketDetail(uuid: string, id: number, request?: Request): Promise<Response<JenisTiket>>
    insertJenisTiket(data: AddJenisTiketRequest,uuid: string, request: Request): Promise<Response<JenisTiket>>
    updateJenisTiket(data: AddJenisTiketRequest,uuid: string,id: number, request: Request): Promise<Response<JenisTiket>>
    deleteJenisTiket(id: number, uuid: string, request: Request): Promise<Response<string>>
}