import { Body, Controller, Get, Patch, Post, Query } from "@nestjs/common";
import { OrderService } from "src/services/order.service";
import { Order, OrderStatus } from "src/types/OrderTypes";
import { OrderResult, RestResponse } from "src/types/ResponseTypes";

@Controller('/order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post('/addorder')
    async addOrder(@Body() order: Order): Promise<RestResponse> {
        const result = await this.orderService.addOrder(order)
        return {
            ...result
        }
    }

    @Get('/getallorders')
    async getAllOrders(): Promise<OrderResult> {
        const result = await this.orderService.getAllOrders()
        return {
            ...result
        }
    }

    @Get('/findbyid')
    async findById(@Query('id') id: string): Promise<OrderResult> {
        const result = await this.orderService.findById(id)
        return {
            ...result
        }
    }

    @Patch('/updateorderstatus')
    async updateOrderStatus(
        @Query('id') id: string,
        @Body('status') status: OrderStatus
    ): Promise<RestResponse> {
        const result = await this.orderService.updateOrderStatus(id, status)
        return {
            ...result
        }
    }
}