import { Logger, Module } from '@nestjs/common';
import * as redisStore from "cache-manager-redis-store"
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger("APPMODULE")
        const host = configService.get("REDIS_HOST")
        const port = configService.get("REDIS_PORT")

        try {
          return {
            store: redisStore,
            host,
            port,
            ttl: 60 * 1000,
            max: 100
          }
        } catch(error) {
          logger.error(`failed to initialize redis: ${error}`)
          throw error
        }
      }
    })
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, PrismaService, ProductService],
})
export class AppModule {}
