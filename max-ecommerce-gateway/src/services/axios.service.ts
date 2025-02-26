import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosInstance } from "axios";
import axios from "axios";

@Injectable()
export class AxiosService {
    private readonly axiosInstance: AxiosInstance

    constructor(private configService: ConfigService) {
        this.axiosInstance = axios.create({
            timeout: 5000,
            headers: {
                "Content-Type": "application/json"
            }
        })
        this.setupInterceptors()
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use(
            response => response,
            error => Promise.reject(error)
        )
    }

    get client() {
        return this.axiosInstance
    }
}