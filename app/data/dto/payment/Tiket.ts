import { User } from "~/data/entity/auth/User";
import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { PaymentHistory } from "./PaymentHistory";


export interface Tiket {
    id: number;
    uuid: string;
    statusTiket: boolean;
    user: Partial<User>;
    jenisTiket: JenisTiket;
    paymentTransaction: string;
    paymentHistory: PaymentHistory;
}
