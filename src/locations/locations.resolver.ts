import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import { DeletedLocation, Location } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { DecodedToken } from 'src/auth/interfaces/auth.interface';
import { PolicyGuard } from 'src/auth/policy.guard';
import { CheckPolicies } from 'src/auth/decorators/policy.decorator';
import { UseGuards } from '@nestjs/common';
import { Action, AppAbility } from 'src/casl/interfaces/casl.interface';

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) { }

  @Mutation(() => Location)
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput, @Context("token") token: DecodedToken) {
    return this.locationsService.create(createLocationInput, token);
  }

  @Query(() => [Location], { name: 'locations' })
  findAll(@Context("token") token: DecodedToken) {
    return this.locationsService.findAll(token.sub);
  }

  @UseGuards(PolicyGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Location))
  @Query(() => Location, { name: 'location' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @Context("userAbility") ability: AppAbility
  ) {
    return this.locationsService.findOne(ability, id);
  }

  @UseGuards(PolicyGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Location))
  @Mutation(() => Location)
  updateLocation(
    @Args('updateLocationInput') updateLocationInput: UpdateLocationInput,
    @Context("userAbility") ability: AppAbility
  ) {
    return this.locationsService.update(ability, updateLocationInput.id, updateLocationInput);
  }

  @UseGuards(PolicyGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Location))
  @Mutation(() => DeletedLocation)
  async removeLocation(
    @Args("id", { type: () => Int }) id: number,
    @Context("userAbility") ability: AppAbility
  ) {
    await this.locationsService.remove(ability, id);
    return { id }
  }
}
