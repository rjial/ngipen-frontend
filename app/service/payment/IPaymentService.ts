import { PaymentResponse } from "~/data/dto/payment/PaymentResponse";
import { Response } from "~/data/entity/Response";
import { PaymentService } from "./PaymentService";
import { FetchClient } from "../FetchClient.server";
import { PaymentRequest } from "~/data/dto/payment/PaymentRequest";
import { PaymentTransactionResponse } from "~/data/dto/payment/PaymentTransactionResponse";

export class IPaymentService implements PaymentService {
    getPayment(data: {uuid: string, request: Request; }): Promise<Response<PaymentTransactionResponse>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<PaymentTransactionResponse>(`/payment/${data.uuid}`, data.request)
    }
    getPayments(data: { request: Request; }): Promise<Response<PaymentTransactionResponse[]>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<PaymentTransactionResponse[]>("/payment", data.request)
    }
    payment(data: { data: PaymentRequest; request: Request; }): Promise<Response<PaymentResponse>> {
        const fetchClient = new FetchClient()
        return fetchClient.post<PaymentResponse, PaymentRequest>("/payment", data.data, data.request)
    }
    
    
}