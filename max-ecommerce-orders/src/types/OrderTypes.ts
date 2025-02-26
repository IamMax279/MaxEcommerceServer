import { OrderResult, RestResponse } from "./ResponseTypes"

export enum OrderStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED'
}

export interface Order {
    customerId: string
    purchasedProducts: string[]
}

export interface OrderInfo extends Order {
    status: string
}

export interface IOrderService {
    addOrder(order: Order): Promise<RestResponse>;
    getAllOrders(): Promise<OrderResult>;
    findById(orderId: string): Promise<OrderResult>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<RestResponse>;
}