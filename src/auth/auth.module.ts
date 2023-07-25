import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get("jwt"),
      inject: [ConfigService]
    }),
    UsersModule],
  providers: [AuthResolver, AuthService],
  exports: [AuthService]
})
export class AuthModule { }
