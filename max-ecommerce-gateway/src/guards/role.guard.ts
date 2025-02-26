import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const client: Request = context.switchToHttp().getRequest()
        const auth: String = client.headers['authorization']

        if(!auth || !auth.startsWith("Bearer ")) {
            console.log("no token found")
            return false
        }

        const token = auth.substring(7)
        const payload = JSON.parse(atob(token.split('.')[1]))

        if(!payload || payload.role !== 'ADMIN') {
            console.log("user is not allowed to perform this action")
            return false
        }

        return true
    }
}