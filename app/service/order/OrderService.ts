import { OrderDataRequest, OrderRequest } from "~/data/dto/order/OrderRequest";
import { OrderResponse } from "~/data/dto/order/OrderResponse";
import { Response } from "~/data/entity/Response";

export interface OrderService {
    order(order: OrderRequest, data: OrderDataRequest): Promise<Response<OrderResponse[]>> 
}