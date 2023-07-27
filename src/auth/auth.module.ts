import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { jwtConfig } from 'src/config/config';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({
        load: [jwtConfig],
        envFilePath: join(process.cwd(), ".env." + process.env.NODE_ENV || "development"),
      })],
      useFactory: (configService: ConfigService) => configService.get("jwt"),
      inject: [ConfigService]
    }),
    UsersModule],
  providers: [AuthResolver, AuthService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
  exports: [AuthService]
})
export class AuthModule { }
