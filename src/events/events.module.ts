import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { UsersModule } from "../users/users.module";
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { LocationsModule } from 'src/locations/locations.module';
import { CaslModule } from 'src/casl/casl.module';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UsersModule, AuthModule, LocationsModule, CaslModule],
  providers: [EventsResolver, EventsService, JwtService,
    {
      provide: "NOTIFICATION_SERVICE",
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get("redis"))
      },
      inject: [ConfigService]
    }
  ],
})
export class EventsModule { }
