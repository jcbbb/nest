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
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UsersModule, AuthModule, LocationsModule, CaslModule],
  providers: [EventsResolver, EventsService, JwtService,
    {
      provide: "PUB_SUB",
      useFactory: (configService: ConfigService) => {
        const options = configService.get("redis");
        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options)
        })
      },
      inject: [ConfigService]
    },
  ],
})
export class EventsModule { }
