import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DecodedToken } from 'src/auth/interfaces/auth.interface';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) { }

  create(createEventInput: CreateEventInput, token: DecodedToken) {
    const { title, description, end_at, start_at, location_id } = createEventInput;
    const entity = this.eventsRepository.create({
      title, description, end_at, start_at, location_id, created_by: token.sub
    });

    return this.eventsRepository.save(entity)
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
