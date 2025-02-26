export interface Order {
    customerId: string
    purchasedProducts: string[]
}

export interface OrderInfo extends Order {
    status: string
}

export enum OrderStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED'
}