import { GetCheckoutsRequest } from "~/data/dto/checkout/GetCheckoutsRequest";
import { UpdateCheckoutRequest } from "~/data/dto/checkout/UpdateCheckoutRequest";
import { Response } from "~/data/entity/Response";
import { Checkout } from "~/data/entity/checkout/Checkout";

export interface CheckoutService {
    getCheckouts(data: GetCheckoutsRequest): Promise<Response<Checkout[]>>
    updateCheckout(data: {data: UpdateCheckoutRequest, request: Request}): Promise<Response<Checkout>>
}