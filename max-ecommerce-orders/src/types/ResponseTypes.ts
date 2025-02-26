import { Order, OrderInfo } from "./OrderTypes"

export interface RestResponse {
    success: boolean
    message: string
}

export interface OrderResult extends RestResponse {
    orders?: OrderInfo[] | OrderInfo
}