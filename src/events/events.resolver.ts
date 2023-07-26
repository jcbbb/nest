import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Context } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { DeletedEvent, Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { UsersService } from 'src/users/users.service';
import { Inject } from '@nestjs/common';
import { DecodedToken } from 'src/auth/interfaces/auth.interface';
import { LocationsService } from 'src/locations/locations.service';

@Resolver(() => Event)
export class EventsResolver {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly locationsService: LocationsService,
  ) { }

  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput, @Context("token") token: DecodedToken) {
    return this.eventsService.create(createEventInput, token);
  }

  @Query(() => [Event], { name: 'events' })
  findAll(@Context("token") token: DecodedToken) {
    return this.eventsService.findAll(token.sub);
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
  location(@Parent() event: Event) {
    return this.locationsService.findOne(event.location_id)
  }

  @ResolveField()
  creator(@Parent() event: Event) {
    return this.usersService.findOne(event.created_by)
  }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => DeletedEvent)
  async removeEvent(@Args('id', { type: () => Int }) id: number) {
    await this.eventsService.remove(id);
    return { id }
  }
}
