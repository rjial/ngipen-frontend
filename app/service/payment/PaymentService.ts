import { PaymentHistory } from "~/data/dto/payment/PaymentHistory";
import { PaymentRequest } from "~/data/dto/payment/PaymentRequest";
import { PaymentResponse } from "~/data/dto/payment/PaymentResponse";
import { PaymentTransactionResponse } from "~/data/dto/payment/PaymentTransactionResponse";
import { TiketItemListResponse } from "~/data/dto/ticket/TiketItemListResponse";
import { Response } from "~/data/entity/Response";
import { Page } from "~/data/entity/common/Page";
import { Tiket } from "~/data/entity/ticket/Tiket";

export interface PaymentService {
    pay(data: {uuid: string, request: Request}): Promise<Response<PaymentResponse>>
    payment(data: {data: PaymentRequest, request: Request}): Promise<Response<PaymentResponse>>
    getPayments(data: {request: Request}): Promise<Response<PaymentTransactionResponse[]>>
    getPayment(data: {uuid: string, request: Request}): Promise<Response<PaymentTransactionResponse>>
    getPaymentTransactionsByEvent(data: {uuidEvent: string, page: number, size: number}, request: Request): Promise<Response<Page<PaymentTransactionResponse>>>
    getPaymentTransactionPaymentGatewayStatus(data: {uuidEvent: string}, request: Request): Promise<Response<string>>
    getPaymentTransactionHistories(data: {uuidEvent: string}, request: Request): Promise<Response<PaymentHistory[]>>
    getPaymentTransactionItemByEvent(data: {uuidEvent: string, uuidPt: string}, request: Request): Promise<Response<PaymentTransactionResponse>>
    getTiketsByPaymentTransactionAndEvent(data: {uuidEvent: string, uuidPt: string, page: number, size: number}, request: Request): Promise<Response<TiketItemListResponse[]>>
}