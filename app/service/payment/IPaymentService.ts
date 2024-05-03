import { PaymentResponse } from "~/data/dto/payment/PaymentResponse";
import { Response } from "~/data/entity/Response";
import { PaymentService } from "./PaymentService";
import { FetchClient } from "../FetchClient.server";
import { PaymentRequest } from "~/data/dto/payment/PaymentRequest";
import { PaymentTransactionResponse } from "~/data/dto/payment/PaymentTransactionResponse";
import { Page } from "~/data/entity/common/Page";

export class IPaymentService implements PaymentService {
    getPaymentTransactionsByEvent(data: { uuidEvent: string; page: number; size: number; }, request: Request): Promise<Response<Page<PaymentTransactionResponse>>> {
        const fetchClient = new FetchClient()
        return fetchClient.get<Page<PaymentTransactionResponse>>(`/payment/event/${data.uuidEvent}?page=${data.page}&size=${data.size}`, request)
    }
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