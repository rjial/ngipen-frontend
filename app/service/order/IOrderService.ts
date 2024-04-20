import { OrderDataRequest, OrderRequest } from "~/data/dto/order/OrderRequest";
import { OrderResponse } from "~/data/dto/order/OrderResponse";
import { Response } from "~/data/entity/Response";
import { OrderService } from "./OrderService";
import { FetchClient } from "../FetchClient.server";

export class IOrderService implements OrderService {
    constructor(request: Request | undefined = undefined) {
        this.request = request
    }
    private request: Request | undefined
    order({uuid}: OrderRequest, data: OrderDataRequest): Promise<Response<OrderResponse[]>> {
        const fetchClient = new FetchClient();
        return fetchClient.post<OrderResponse[], OrderDataRequest>(`/order/${uuid}`, data, this.request)
    }

}