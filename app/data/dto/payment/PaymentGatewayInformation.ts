
export interface PaymentGatewayInformation {
    id: number;
    uuid: string;
    transactionType: string;
    transactionTime: string;
    transactionStatus: string;
    transactionID: string;
    statusMessage: string;
    statusCode: string;
    signatureKey: string;
    referenceID: string;
    paymentType: string;
    orderID: string;
    merchantID: string;
    grossAmount: string;
    fraudStatus: string;
    expiryTime: string;
    currency: string;
    acquirer: string;
    paymentTransaction: string;
}
