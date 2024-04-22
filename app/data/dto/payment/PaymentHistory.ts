import { User } from "~/data/entity/auth/User";
import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { Event } from "./PaymentResponse";


export interface PaymentHistory {
    id: number;
    total: number;
    event: Event;
    jenisTiket: JenisTiket;
    user: Partial<User>;
    paymentTransaction: string;
}
