import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ProductService } from "src/services/product.service";
import { Product, ProductMod } from "src/types/ProductTypes";
import { CategoryFilteredProducts, RestResponse } from "src/types/ResponseTypes";

@Controller('/product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Post('/addnewproduct')
    async addNewProduct(@Body() productData: Product): Promise<RestResponse> {
        const result = await this.productService.addNewProduct(productData)
        return {
            success: result.success,
            message: result.message
        }
    }

    @Post('/increaseproductquantity')
    async increaseProductQuantity(@Body() productData: ProductMod): Promise<RestResponse> {
        const result = await this.productService.updateProductQuantity(productData)
        return {
            success: result.success,
            message: result.message
        }
    }

    @Get('/getallproducts')
    async getAllProducts(): Promise<Product[]> {
        return this.productService.findAllProducts()
    }

    @Get('/getbycategory')
    async getByCategory(@Query('category') category: string): Promise<CategoryFilteredProducts> {
        const result = await this.productService.getByCategory(category)
        return {
            success: result.success,
            message: result.message,
            products: result.products ? result.products : []
        }
    }
}