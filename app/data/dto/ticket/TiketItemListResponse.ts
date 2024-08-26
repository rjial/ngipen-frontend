export interface TiketItemListResponse {
    uuid: string;
    statusTiket: boolean;
    user: {uuid: string, namaUser: string, email: string, alamat: string, nohp: string};
    jenisTiket: string;
    event: string;
    date: string;
    price: number;
    waktu_awal: string;
    waktu_akhir: string;
    lokasi: string;
    statusVerifikasi: boolean;
    paymentTransaction: string;
}