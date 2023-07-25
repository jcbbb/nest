import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { UsersService } from 'src/users/users.service';
import { Inject } from '@nestjs/common';

@Resolver(() => Event)
export class EventsResolver {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) { }

  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventsService.create(createEventInput);
  }

  @Query(() => [Event], { name: 'events' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Query(() => Event, { name: 'event' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.findOne(id);
  }

  @ResolveField()
  participants(@Parent() event: Event) {
    return this.eventsService.getParticipants(event.id)
  }

  @ResolveField()
  creator(@Parent() event: Event) {
    return this.usersService.findOne(event.created_by)
  }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.remove(id);
  }
}
