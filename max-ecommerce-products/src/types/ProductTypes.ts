import { RestResponse, CategoryFilteredProducts } from "./ResponseTypes"

export interface Product {
    name: string
    category: string
    quantity: number
    price: number
}

export interface ProductMod {
    name: string
    quantity: number
} 

export interface IProductService {
    addNewProduct(product: Product): Promise<RestResponse>;
    updateProductQuantity(productData: ProductMod): Promise<RestResponse>;
    findAllProducts(): Promise<Product[]>;
    getByCategory(category: string): Promise<CategoryFilteredProducts>;
}