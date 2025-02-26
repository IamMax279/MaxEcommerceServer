import { RestResponse } from "./ResponseTypes"

export interface User {
    firstName: string
    lastName: string
    email: string
    password: string
}

export enum UserRoles {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface LoginData {
    email: string,
    password: string
}

export interface IUserService {
    register(userData: User): Promise<RestResponse>;
    setUserEmailVerified(userId: string): Promise<void>;
    signIn(loginData: LoginData): Promise<RestResponse>;
}