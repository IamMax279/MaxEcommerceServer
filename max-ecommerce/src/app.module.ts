import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './services/user.service';
import { PrismaService } from './services/prisma.service';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService, AuthService]
})
export class AppModule {}
