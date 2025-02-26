import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UserService } from "src/services/user.service";
import { RestResponse, SignInResponse } from "src/types/ResponseTypes";
import * as jwt from "jsonwebtoken"
import { LoginData, User } from "src/types/UserTypes";

@Controller('/user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register')
    async register(@Body() userData: User): Promise<RestResponse> {
        const result = await this.userService.register(userData)
        return {
            success: result.success,
            message: result.message
        }
    }

    @Post('/signin')
    async signIn(@Body() loginData: LoginData): Promise<SignInResponse> {
        const result = await this.userService.signIn(loginData)
        return {
            success: result.success,
            message: result.message,
            jwt: result.jwt ? result.jwt : ""
        }
    }

    @Get('/verify-email')
    async verifyEmail(@Query('token') token: string): Promise<RestResponse> {
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
            await this.userService.setUserEmailVerified(decoded.id)
            return {
                success: true,
                message: "email verified successfully"
            }
        } catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "something went wrong verifying email"
            }
        }
    }
}