import { Product } from "@prisma/client"

export interface RestResponse {
    success: boolean
    message: string
}

export interface CategoryFilteredProducts extends RestResponse {
    products?: Partial<Product>[]
}