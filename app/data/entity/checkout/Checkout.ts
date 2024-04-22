export interface Checkout {
    uuid:       string;
    total:      number;
    event:      string;
    jenisTiket: CheckoutJenisTiket;
    user:       string;
}

export interface CheckoutJenisTiket {
    id: number;
    nama: string;
    harga: number;
}