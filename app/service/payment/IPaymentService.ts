import { PaymentResponse } from "~/data/dto/payment/PaymentResponse";
import { Response } from "~/data/entity/Response";
import { PaymentService } from "./PaymentService";
import { FetchClient } from "../FetchClient.server";
import { PaymentRequest } from "~/data/dto/payment/PaymentRequest";

export class IPaymentService implements PaymentService {
    payment(data: { data: PaymentRequest; request: Request; }): Promise<Response<PaymentResponse>> {
        const fetchClient = new FetchClient()
        return fetchClient.post<PaymentResponse, PaymentRequest>("/payment", data.data, data.request)
    }
    
    
}