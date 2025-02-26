import { Inject, Injectable } from "@nestjs/common";
import { IProductService, Product, ProductMod } from "src/types/ProductTypes";
import { CategoryFilteredProducts, RestResponse } from "src/types/ResponseTypes";
import { PrismaService } from "./prisma.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class ProductService implements IProductService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async addNewProduct(product: Product): Promise<RestResponse> {
        if(!product.name.trim() || !product.category.trim() || !product.quantity || !product.price || product.quantity < 1 || product.price <= 0) {
            return {
                success: false,
                message: "all values must be given properly"
            }
        }

        try {
            await this.prisma.product.create({
                data: {
                    name: product.name,
                    category: product.category,
                    quantity: Number(product.quantity),
                    price: Number(product.price)
                }
            })
            return {
                success: true,
                message: "added a new product successfully"
            }
        } catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "error adding a new product"
            }
        }
    }

    async updateProductQuantity(productData: ProductMod): Promise<RestResponse> {
        try {
            if(!productData.name.trim() || !productData.quantity || productData.quantity < 1) {
                return {
                    success: false,
                    message: "product name and quantity must be provided properly"
                }
            }
    
            const product = await this.prisma.product.findFirst({where: {name: productData.name}})
            if(!product) {
                return {
                    success: false,
                    message: "a product with such name does not exist in the db"
                }
            }
    
            const newQuantity = product.quantity + Number(productData.quantity)
            if(typeof newQuantity !== 'number') {
                return {
                    success: false,
                    message: "error converting to int"
                }
            }
    
            await this.prisma.product.update({
                where: {
                    name: productData.name
                },
                data: {
                    quantity: newQuantity
                }
            })
    
            return {
                success: true,
                message: `updated (${productData.name})'s quantity successfully`
            }
        } catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "error updating product quantity"
            }
        }
    }

    async findAllProducts(): Promise<Product[]> {
        const cachedProducts = await this.cacheManager.get<Product[]>('all_products')
        if(cachedProducts) {
            return cachedProducts
        }

        const products = await this.prisma.product.findMany()
        const formattedProducts = products.map(({id, createdAt, updatedAt, ...rest}) => ({
            ...rest
        }))

        await this.cacheManager.set('all_products', formattedProducts)
        return formattedProducts
    }

    async getByCategory(category: string): Promise<CategoryFilteredProducts> {
        if(!category.trim()) {
            return {
                success: false,
                message: "you must pass a proper category"
            }
        }

        const cacheKey = category + "_products"
        const categoryCached = await this.cacheManager.get<Product[]>(cacheKey)
        if(categoryCached) {
            return {
                success: true,
                message: `products with ${category} found successfully`,
                products: categoryCached
            }
        }

        const products = await this.prisma.product.findMany({
            where: {category: category}
        })

        if(products.length === 0) {
            return {
                success: false,
                message: "no available products with that category"
            }
        }

        const foundProducts = products.map(({id, createdAt, updatedAt, ...rest}) => ({
            ...rest
        }))
        const result = {
            success: true,
            message: `products with ${category} category found successfully`,
            products: foundProducts
        }

        await this.cacheManager.set(cacheKey, foundProducts)
        return result
    }
}