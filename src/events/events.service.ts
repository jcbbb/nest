import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createEventInput: CreateEventInput, token: DecodedToken) {
    const { title, description, end_at, start_at, location_id } = createEventInput;
    const { identifiers } = await this.eventsRepository
      .createQueryBuilder()
      .insert()
      .into(Event)
      .values({
        title, description, end_at, start_at, location_id, created_by: token.sub
      })
      .execute();

    return { title, description, end_at, start_at, location_id, created_by: token.sub, id: identifiers[0].id }
  }

  findAll(id: number) {
    return this.eventsRepository.find({ where: { created_by: id } });
  }

  async findOne(id: number) {
    const result = await this.eventsRepository.findOne({ where: { id } })
    if (!result) throw new NotFoundException()
    return result;
  }

  async update(id: number, updateEventInput: UpdateEventInput) {
    const { title, description, end_at, start_at, location_id } = updateEventInput;
    const result = await this.eventsRepository.createQueryBuilder().update(Event).set({
      title,
      description,
      end_at,
      start_at,
      location_id
    })
      .where({ id })
      .returning(["title", "description", "end_at", "start_at", "location_id", "id"]).execute()

    if (!result.affected) {
      throw new NotFoundException()
    }

    return result.raw[0]
  }

  remove(id: number) {
    return this.eventsRepository.delete(id);
  }

  getParticipants(id: number) {
    return this.eventsRepository.createQueryBuilder().relation(Event, "participants").of(id).loadMany();
  }
}
