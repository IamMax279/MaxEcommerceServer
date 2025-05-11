import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

import * as jwt from "jsonwebtoken"

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const client: Request = context.switchToHttp().getRequest()
        const auth: String = client.headers['authorization']

        if(!auth || !auth.startsWith("Bearer ")) {
            return false
        }

        const token = auth.substring(7)
        try {
            jwt.verify(token, process.env.JWT_SECRET!)
            return true
        } catch(error) {
            return false
        }
    }
}