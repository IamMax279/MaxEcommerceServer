import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderService } from './services/order.service';
import { PrismaService } from './services/prisma.service';
import { OrderController } from './controllers/order.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from "cache-manager-redis-store"

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get("REDIS_HOST")
        const port = configService.get("REDIS_PORT")

        try {
          return {
            store: redisStore,
            host,
            port,
            ttl: 1000 * 60,
            max: 100
          }
        } catch(error) {
          throw new Error(error instanceof Error ? error.message : "error initializing redis")
        }
      }
    })
  ],
  controllers: [AppController, OrderController],
  providers: [AppService, OrderService, PrismaService],
})
export class AppModule {}
