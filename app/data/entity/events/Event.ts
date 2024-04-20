export interface Event {
    name: string;
    uuid: string;
    lokasi: string;
    desc: string;
    persen: number;
    verifyEvent: boolean;
    pemegangEvent: string;
    tanggal_awal: string;
    waktu_awal: string;
    waktu_akhir: string;
}

export interface PemegangEvent {
    email: string;
    name: string;
    hp: string;
    address: string;
    level: string;
}
