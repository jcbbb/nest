import { ForbiddenException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DecodedToken } from 'src/auth/interfaces/auth.interface';
import { FilterEventInput } from './dto/filter-event.input';
import { Action, AppAbility } from 'src/casl/interfaces/casl.interface';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @Inject("NOTIFICATION_SERVICE") private client: ClientProxy
  ) { }

  // Very important! Spent 4-5 hours on this
  onModuleInit() {
    this.client.connect();
  }

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

  async findAll(id: number, filterEventInput: FilterEventInput) {
    let qb = this.eventsRepository.createQueryBuilder().where({ created_by: id });
    if (filterEventInput.end_at) {
      qb.andWhere({ end_at: LessThanOrEqual(filterEventInput.end_at) })
    }
    if (filterEventInput.start_at) {
      qb.andWhere({ start_at: MoreThanOrEqual(filterEventInput.start_at) })
    }

    if (filterEventInput.location_id) {
      qb.andWhere({ location_id: filterEventInput.location_id })
    }

    return qb.getMany()
  }

  async findOne(ability: AppAbility, id: number) {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException();
    if (!ability.can(Action.Read, event)) throw new ForbiddenException();
    return event;
  }

  async update(ability: AppAbility, id: number, updateEventInput: UpdateEventInput) {
    const event = await this.findOne(ability, id);
    if (!ability.can(Action.Update, event)) throw new ForbiddenException();

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

    return result.raw[0]
  }

  async remove(ability: AppAbility, id: number) {
    const event = await this.findOne(ability, id);
    if (!ability.can(Action.Delete, event)) throw new ForbiddenException();
    return this.eventsRepository.delete(id);
  }

  getParticipants(id: number) {
    return this.eventsRepository.createQueryBuilder().relation(Event, "participants").of(id).loadMany();
  }
}
