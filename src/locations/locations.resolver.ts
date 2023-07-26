import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import { DeletedLocation, Location } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { DecodedToken } from 'src/auth/interfaces/auth.interface';
import { PolicyGuard } from 'src/auth/policy.guard';
import { CheckPolicies } from 'src/auth/decorators/policy.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { UseGuards } from '@nestjs/common';

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
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.locationsService.findOne(id);
  }

  @Mutation(() => Location)
  updateLocation(@Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
    return this.locationsService.update(updateLocationInput.id, updateLocationInput);
  }

  @Mutation(() => DeletedLocation)
  async removeLocation(@Args('id', { type: () => Int }) id: number) {
    await this.locationsService.remove(id);
    return { id }
  }
}
