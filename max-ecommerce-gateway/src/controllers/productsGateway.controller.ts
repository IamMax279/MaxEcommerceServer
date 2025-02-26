import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { AxiosService } from "src/services/axios.service";
import { Product } from "src/types/ProductTypes";
import { RestResponse } from "src/types/ResponseTypes";

@Controller('/api/products')
@UseGuards(AuthGuard)
export class ProductsGateway {
    constructor(private readonly axios: AxiosService) {}
    private readonly productsBaseUrl = process.env.PRODUCTS_URL

    @UseGuards(RoleGuard)
    @Post('/addnewproduct')
    async addProduct(product: Product): Promise<RestResponse> {
        const result = await this.axios.client.post(
            this.productsBaseUrl + "/addnewproduct",
            {...product}
        )
        return {
            ...result.data
        }
    }

    @UseGuards(RoleGuard)
    @Post('/increaseproductquantity')
    async increaseProductQuantity(@Body() productData: Product): Promise<RestResponse> {
        const result = await this.axios.client.post(
            this.productsBaseUrl + "/increaseproductquantity",
            {...productData}
        )
        return {
            ...result.data
        }
    }

    @Get('/getallproducts')
    async getAllProducts(): Promise<Product[]> {
        const result = await this.axios.client.get(
            this.productsBaseUrl + "/getallproducts"
        )
        return {
            ...result.data
        }
    }

    @Get('/getbycategory')
    async getByCategory(@Query('category') category: string): Promise<Product[]> {
        const result = await this.axios.client.get(
            this.productsBaseUrl + `/getbycategory?category=${category}`
        )
        return {
            ...result.data
        }
    }
}