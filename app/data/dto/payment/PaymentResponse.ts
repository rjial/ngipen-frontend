import { User } from "~/data/entity/auth/User";
export interface PaymentResponse {
    paymentTransaction: PaymentTransaction;
    snap_token: string;
    client_key: string;
}

export interface PaymentTransaction {
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