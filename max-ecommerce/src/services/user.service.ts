import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import * as argon2 from "argon2"
import { IUserService, LoginData, User } from "src/types/UserTypes";
import { RestResponse, SignInResponse } from "src/types/ResponseTypes";
import { AuthService } from "./auth.service";

@Injectable()
export class UserService implements IUserService {
    constructor(private prisma: PrismaService, private authService: AuthService) {}

    async register(userData: User): Promise<RestResponse> {
        try {
            if(!userData.email.trim() || !userData.firstName.trim() || !userData.lastName.trim() || !userData.password.trim()) {
                return {
                    success: false,
                    message: "all fields must be filled"
                }
            }

            const hashedPassword = await argon2.hash(userData.password)
            const user = await this.prisma.user.create({
                data: {
                    ...userData,
                    password: hashedPassword
                }
            })

            const token = this.authService.generateVerificationToken(user.id.toString())
            await this.authService.sendVerificationLink(userData.email, token)

            return {
                success: true,
                message: "user created successfully"
            }
        }
        catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "an error occured creating a user"
            }
        }
    }

    async signIn(loginData: LoginData): Promise<SignInResponse> {
        if(!loginData.email.trim() || !loginData.password.trim()) {
            return {
                success: false,
                message: "all fields must be filled"
            }
        }

        const user = await this.prisma.user.findFirst({
            where: {
                email: loginData.email
            }
        })
        if(!user) {
            return {
                success: false,
                message: "user not found"
            }
        }

        if(!user.emailVerified) {
            return {
                success: false,
                message: "email not verified"
            }
        }

        const isValidPassword = await argon2.verify(user.password, loginData.password)
        if(!isValidPassword) {
            return {
                success: false,
                message: "incorrect password"
            }
        }

        const token = this.authService.generateAccessToken(user.id.toString(), user.email)

        return {
            success: true,
            message: "user signed in successfully",
            jwt: token
        }
    }

    async setUserEmailVerified(userId: string): Promise<void> {
        try {
            await this.prisma.user.update({
                where: {
                    id: parseInt(userId)
                },
                data: {
                    emailVerified: true
                }
            })
        } catch(error) {
            throw new Error(`error setting email to verified: ${error}`)
        }
    }
}