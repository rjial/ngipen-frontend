export interface Event {
    name: string;
    uuid: string;
    lokasi: string;
    desc: string;
    persen: number;
    verifyEvent: boolean;
    pemegangEvent: PemegangEvent;
    tanggalAwal: Date;
    waktuAwal: string;
    waktuAkhir: string;
}

export interface PemegangEvent {
    email: string;
    name: string;
    hp: string;
    address: string;
    level: string;
}
