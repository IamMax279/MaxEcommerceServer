import { Injectable } from "@nestjs/common";
import { IAuthService } from "src/types/AuthTypes";
import * as jwt from "jsonwebtoken"
import * as nodemailer from "nodemailer"

@Injectable()
export class AuthService implements IAuthService {
    generateVerificationToken(userId: string): string {
        return jwt.sign({id: userId}, process.env.JWT_SECRET!, {expiresIn: '30m'})
    }

    generateAccessToken(userId: string, email: string): string {
        return jwt.sign({id: userId, email: email}, process.env.JWT_SECRET!, {expiresIn: '15m'})
    }

    async sendVerificationLink(email: string, token: string): Promise<void> {
        if(!email.trim() || !token.trim()) {
            throw new Error("email and token must be passed properly")
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const url = `http://localhost:3000/user/verify-email?token=${token}`

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Email verification",
                html: `<p>Click the <a href="${url}">verification link</a> to verify your email.</p>`
            })
        } catch(error) {
            throw new Error(`error sending email: ${error}`)
        }
    }
}