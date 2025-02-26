import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AxiosService } from "src/services/axios.service";
import { RestResponse, SignInResponse } from "src/types/ResponseTypes";
import { LoginData, User } from "src/types/UserTypes";

@Controller('/api/users')
export class UsersGateway {
    constructor(private readonly axios: AxiosService) {}
    private readonly userBaseUrl = process.env.USERS_URL

    @Post('/register')
    async register(@Body() userData: User): Promise<RestResponse> {
        const result = await this.axios.client.post(
            this.userBaseUrl + "/register",
            {...userData}
        )
        return {
            ...result.data
        }
    }

    @Post('/signin')
    async signIn(@Body() loginData: LoginData): Promise<SignInResponse> {
        const result = await this.axios.client.post(
            this.userBaseUrl + "/signin",
            {...loginData}
        )
        return {
            ...result.data
        }
    }

    @Get('/verify-email')
    async verifyEmail(@Query('token') token: string): Promise<RestResponse> {
        const result = await this.axios.client.get(
            this.userBaseUrl + `/verify-email?token=${token}`
        )
        return {
            ...result.data
        }
    }
}