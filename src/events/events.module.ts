import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UsersModule],
  providers: [EventsResolver, EventsService],
})
export class EventsModule { }
