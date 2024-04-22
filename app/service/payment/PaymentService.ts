import { PaymentRequest } from "~/data/dto/payment/PaymentRequest";
import { PaymentResponse } from "~/data/dto/payment/PaymentResponse";
import { Response } from "~/data/entity/Response";

export interface PaymentService {
    payment(data: {data: PaymentRequest, request: Request}): Promise<Response<PaymentResponse>>
}