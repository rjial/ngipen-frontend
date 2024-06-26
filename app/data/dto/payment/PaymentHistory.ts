import { User } from "~/data/entity/auth/User";
import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { Event } from "../../entity/events/Event";


export interface PaymentHistory {
    id: number;
    total: number;
    event: string;
    jenisTiket: JenisTiket;
    user: string;
}
