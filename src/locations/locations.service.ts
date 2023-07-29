import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { DecodedToken } from 'src/auth/interfaces/auth.interface';
import { Action, AppAbility } from 'src/casl/interfaces/casl.interface';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    private readonly socketGateway: SocketGateway
  ) { }
  async create(createLocationInput: CreateLocationInput, token: DecodedToken) {
    const { name, address } = createLocationInput;
    const { identifiers } = await this.locationsRepository
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values({ name, address, created_by: token.sub })
      .execute()

    return { name, address, created_by: token.sub, id: identifiers[0].id }
  }

  findAll(id: number) {
    return this.locationsRepository.find({ where: { created_by: id } })
  }

  async findOne(ability: AppAbility, id: number) {
    const location = await this.locationsRepository.findOne({ where: { id } })
    if (!location) {
      throw new NotFoundException()
    }

    if (!ability.can(Action.Read, location)) {
      throw new ForbiddenException()
    }

    return location;
  }

  async update(ability: AppAbility, id: number, updateLocationInput: UpdateLocationInput) {
    const { name, address } = updateLocationInput;
    const location = await this.findOne(ability, id);

    if (!ability.can(Action.Update, location)) {
      throw new ForbiddenException();
    }

    const result = await this.locationsRepository
      .createQueryBuilder().update(Location).set({
        name,
        address
      })
      .where({ id })
      .returning(["name", "address", "id"]).execute()

    return result.raw[0]
  }

  async remove(ability: AppAbility, id: number) {
    const location = await this.findOne(ability, id);
    if (!ability.can(Action.Delete, location)) throw new ForbiddenException();
    return this.locationsRepository.delete(id)
  }
}
