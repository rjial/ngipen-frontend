export type JenisTiket = {
    id: number
    nama: string
    harga: number
    event: string
}

export class JenisTiketCount {
    constructor(jenistiket: JenisTiket) {
        this.jenistiket = jenistiket.id
        this.count = 0
    }
    jenistiket: number
    count: number
    increment() {
        this.count++
    }
    decrement() {
        this.count--
    }
}