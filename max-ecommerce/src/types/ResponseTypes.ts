export interface RestResponse {
    success: boolean
    message: string
}

export interface SignInResponse extends RestResponse {
    jwt?: string
}