import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { UsersModule } from "../users/users.module";
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UsersModule, AuthModule],
  providers: [EventsResolver, EventsService, JwtService],
})
export class EventsModule { }
