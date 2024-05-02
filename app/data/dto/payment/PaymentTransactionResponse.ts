import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { Tiket } from "../../entity/ticket/Tiket";

export interface PaymentTransactionResponse {
    uuid:                string;
    total:               number;
    snapToken:           string;
    date:                string;
    status:              string;
    user:                string;
    tikets:              Tiket[];
    paymentTransactions: PaymentTransaction[];
}

export interface PaymentTransaction {
    id:         number;
    total:      number;
    event:      string;
    jenisTiket: JenisTiket;
    user:       string;
}