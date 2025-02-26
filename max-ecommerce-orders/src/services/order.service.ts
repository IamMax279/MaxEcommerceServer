import { Inject, Injectable } from "@nestjs/common";
import { IOrderService, Order, OrderInfo, OrderStatus } from "src/types/OrderTypes";
import { OrderResult, RestResponse } from "src/types/ResponseTypes";
import { PrismaService } from "./prisma.service";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class OrderService implements IOrderService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async addOrder(order: Order): Promise<RestResponse> {
        try {
            if(!order.customerId || !order.purchasedProducts) {
                return {
                    success: false,
                    message: "both customer id and purchased products must be provided"
                }
            }

            const newOrder = await this.prisma.order.create({
                data: {
                    customerId: BigInt(order.customerId),
                    purchasedProducts: order.purchasedProducts.map(p => BigInt(p)),
                    status: OrderStatus.PENDING
                }
            })

            return {
                success: true,
                message: "successfully added a new order"
            }
        } catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "error adding an order"
            }
        }
    }

    async getAllOrders(): Promise<OrderResult> {
        try {
            const cachedOrders = await this.cacheManager.get<OrderInfo[]>('all_orders')
            if(cachedOrders) {
                return {
                    success: true,
                    message: "all orders found successfully (cached)",
                    orders: cachedOrders
                }
            }

            const orders = await this.prisma.order.findMany()
            const formattedOrders = orders.map(({status, customerId, purchasedProducts}) => ({
                status,
                customerId: customerId.toString(),
                purchasedProducts: purchasedProducts.map(String)
            }))
            
            await this.cacheManager.set('all_orders', formattedOrders)

            return {
                success: true,
                message: "all orders found successfully",
                orders: formattedOrders
            }
        } catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "error getting all orders"
            }
        }
    }

    async findById(orderId: string): Promise<OrderResult> {
        try {
            const cachedOrder = await this.cacheManager.get<OrderInfo>(`order${orderId}`)
            if(cachedOrder) {
                return {
                    success: true,
                    message: "found order successfully (cached)",
                    orders: cachedOrder
                }
            }
    
            const order = await this.prisma.order.findFirst({
                where: {id: BigInt(orderId)}
            })
            if(!order) {
                return {
                    success: false,
                    message: "cannot find an order with such id"
                }
            }

            const formattedOrder: OrderInfo = {
                status: order.status,
                customerId: order.customerId.toString(),
                purchasedProducts: order.purchasedProducts.map(String)
            }
            await this.cacheManager.set(`order${orderId}`, formattedOrder)

            return {
                success: true,
                message: "found order successfully",
                orders: formattedOrder
            }
        } catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "error fiding an order by id"
            }
        }
    }

    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<RestResponse> {
        try {
            const order = await this.findById(orderId)
            if(!order) {
                return {
                    success: false,
                    message: "could not find an order with the given id"
                }
            }

            await this.prisma.order.update({
                where: {id: BigInt(orderId)},
                data: {status: status}
            })

            return {
                success: true,
                message: "updated status order successfully"
            }
        } catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "error updating order status"
            }
        }
    }
}