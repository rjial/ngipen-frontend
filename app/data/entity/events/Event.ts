export interface Event {
    name: string;
    uuid: string;
    lokasi: string;
    desc: string;
    verifyEvent: boolean;
    pemegangEvent: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    waktu_awal: string;
    waktu_akhir: string;
    headerimageurl: string;
    itemimageurl: string;
}

export interface PemegangEvent {
    email: string;
    name: string;
    hp: string;
    address: string;
    level: string;
}
