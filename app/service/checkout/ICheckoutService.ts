import { GetCheckoutsRequest } from "~/data/dto/checkout/GetCheckoutsRequest";
import { Response } from "~/data/entity/Response";
import { Checkout } from "~/data/entity/checkout/Checkout";
import { CheckoutService } from "./CheckoutService";
import { FetchClient } from "../FetchClient.server";
import { UpdateCheckoutRequest } from "~/data/dto/checkout/UpdateCheckoutRequest";

export class ICheckoutService implements CheckoutService {
    updateCheckout({data, request}: { data: UpdateCheckoutRequest; request: Request; }): Promise<Response<Checkout>> {
        const fetchClient = new FetchClient()
        return fetchClient.put<Checkout, UpdateCheckoutRequest>(`/checkout/${data.uuid}`, data, request)
    }
    getCheckouts(data: GetCheckoutsRequest): Promise<Response<Checkout[]>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Checkout[]>("/checkout", data.request)
    }
}