export interface OrderRequest {
    uuid: string
}

export interface OrderDataRequest {
    orders: OrderItemRequest[]
}

export interface OrderItemRequest {
    total:      number;
    jenisTiket: number;
}