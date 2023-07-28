import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Context, Subscription } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { DeletedEvent, Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { UsersService } from 'src/users/users.service';
import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { DecodedToken } from 'src/auth/interfaces/auth.interface';
import { LocationsService } from 'src/locations/locations.service';
import { FilterEventInput } from './dto/filter-event.input';
import { PolicyGuard } from 'src/auth/policy.guard';
import { CheckPolicies } from 'src/auth/decorators/policy.decorator';
import { Action, AppAbility } from 'src/casl/interfaces/casl.interface';
import { User } from 'src/users/entities/user.entity';
import { RedisPubSub } from "graphql-redis-subscriptions";
import { AddParticipantInput } from './dto/add-participant.input';

@Injectable()
@Resolver(() => Event)
export class EventsResolver {
  constructor(
    @Inject("PUB_SUB") private readonly pubSub: RedisPubSub,
    @Inject(UsersService) private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly locationsService: LocationsService,
  ) { }

  @Subscription(() => User, {
    filter: (payload, variables) => payload.event === variables.event
  })

  participantAdded(@Args("event", { type: () => Int }) event: number) {
    return this.pubSub.asyncIterator("participantAdded")
  }

  @UseGuards(PolicyGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Event))
  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput, @Context("token") token: DecodedToken) {
    return this.eventsService.create(createEventInput, token);
  }

  @Query(() => [Event], { name: 'events' })
  async findAll(@Args('filterEventInput', { nullable: true }) filterEventInput: FilterEventInput, @Context("token") token: DecodedToken) {
    return this.eventsService.findAll(token.sub, filterEventInput);
  }

  @Mutation(() => User)
  async addParticipant(@Args("addParticipantInput") addParticipantInput: AddParticipantInput) {
    const user = await this.eventsService.addParticipant(addParticipantInput)
    this.pubSub.publish("participantAdded", { participantAdded: user, event: addParticipantInput.event })
    return user;
  }

  @UseGuards(PolicyGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Event))
  @Query(() => Event, { name: 'event' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @Context("userAbility") ability: AppAbility
  ) {
    return this.eventsService.findOne(ability, id);
  }

  @ResolveField()
  participants(@Parent() event: Event) {
    return this.eventsService.getParticipants(event.id)
  }

  @ResolveField()
  location(
    @Parent() event: Event,
    @Context("userAbility") ability: AppAbility
  ) {
    return this.locationsService.findOne(ability, event.location_id)
  }

  @ResolveField()
  creator(@Parent() event: Event) {
    return this.usersService.findOne(event.created_by)
  }

  @UseGuards(PolicyGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Event))
  @Mutation(() => Event)
  updateEvent(
    @Args("updateEventInput") updateEventInput: UpdateEventInput,
    @Context("userAbility") ability: AppAbility
  ) {
    return this.eventsService.update(ability, updateEventInput.id, updateEventInput);
  }

  @UseGuards(PolicyGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Event))
  @Mutation(() => DeletedEvent)
  async removeEvent(
    @Args("id", { type: () => Int }) id: number,
    @Context("userAbility") ability: AppAbility
  ) {
    await this.eventsService.remove(ability, id);
    return { id }
  }
}
