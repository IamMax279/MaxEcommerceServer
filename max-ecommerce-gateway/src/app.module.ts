import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { RoleGuard } from './guards/role.guard';
import { AxiosService } from './services/axios.service';
import { ProductsGateway } from './controllers/productsGateway.controller';
import { UsersGateway } from './controllers/usersGateway.controller';
import { OrdersGateway } from './controllers/ordersGateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true //available across the app
    })
  ],
  controllers: [AppController, ProductsGateway, UsersGateway, OrdersGateway],
  providers: [AppService, AuthGuard, RoleGuard, AxiosService],
})
export class AppModule {}
