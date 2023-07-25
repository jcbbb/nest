import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) { }

  create(createEventInput: CreateEventInput) {
    return this.eventsRepository
      .createQueryBuilder()
      .insert()
      .into(Event)
      .values({ ...createEventInput, created_by: 1 }).execute()
  }

  findAll() {
    return this.eventsRepository.find();
  }

  findOne(id: number) {
    return this.eventsRepository.findOne({ where: { id } })
  }

  update(id: number, updateEventInput: UpdateEventInput) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }

  getParticipants(id: number) {
    return this.eventsRepository.createQueryBuilder().relation(Event, "participants").of(id).loadMany();
  }
}
