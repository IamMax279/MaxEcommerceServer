import { Body, Controller, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { AxiosService } from "src/services/axios.service";
import { Order, OrderStatus } from "src/types/OrderTypes";
import { OrderResult, RestResponse } from "src/types/ResponseTypes";

@Controller('/api/orders')
@UseGuards(AuthGuard)
export class OrdersGateway {
    constructor(private readonly axios: AxiosService) {}
    private readonly ordersBaseUrl = process.env.ORDERS_URL

    @Post('/addorder')
    async addOrder(@Body() order: Order): Promise<RestResponse> {
        const result = await this.axios.client.post(
            this.ordersBaseUrl + "/addorder",
            {...order}
        )
        return {
            ...result.data
        }
    }

    @UseGuards(RoleGuard)
    @Get('/getallorders')
    async getAllOrders(): Promise<OrderResult> {
        const result = await this.axios.client.get(
            this.ordersBaseUrl + "/getallorders"
        )
        return {
            ...result.data
        }
    }

    @UseGuards(RoleGuard)
    @Get('/findbyid')
    async findById(@Query('id') id: string): Promise<OrderResult> {
        const result = await this.axios.client.get(
            this.ordersBaseUrl + `/findbyid?id=${id}`
        )
        return {
            ...result.data
        }
    }

    @UseGuards(RoleGuard)
    @Patch('/updateorderstatus')
    async updateOrderStatus(
        @Query('id') id: string,
        @Body() status: OrderStatus
    ): Promise<RestResponse> {
        const result = await this.axios.client.patch(
            this.ordersBaseUrl + `/updateorderstatus?id=${id}`,
            {status}
        )
        return {
            ...result.data
        }
    }
}