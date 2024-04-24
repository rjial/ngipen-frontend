import { PaymentRequest } from "~/data/dto/payment/PaymentRequest";
import { PaymentResponse } from "~/data/dto/payment/PaymentResponse";
import { PaymentTransactionResponse } from "~/data/dto/payment/PaymentTransactionResponse";
import { Response } from "~/data/entity/Response";

export interface PaymentService {
    payment(data: {data: PaymentRequest, request: Request}): Promise<Response<PaymentResponse>>
    getPayments(data: {request: Request}): Promise<Response<PaymentTransactionResponse[]>>
    getPayment(data: {uuid: string, request: Request}): Promise<Response<PaymentTransactionResponse>>
}