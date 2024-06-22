import { User } from "~/data/entity/auth/User";
export interface PaymentResponse {
    payment_transaction: PaymentTransactionAfterCheckoutResponse;
    snap_token: string;
    client_key: string;
}

export interface PaymentTransactionAfterCheckoutResponse {
    uuid: string;
    total: number;
    date: string;
    status: string;
    user: Partial<User>;
    paymentGatewayInformation: null;
    tikets: null;
}

export function isPaymentResponse(paymentResponse: Object): paymentResponse is PaymentResponse {
    return (paymentResponse as PaymentResponse).client_key !== undefined
}