import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { DecodedToken } from 'src/auth/interfaces/auth.interface';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
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

  findOne(id: number) {
    return this.locationsRepository.findOne({ where: { id } })
  }

  async update(id: number, updateLocationInput: UpdateLocationInput) {
    const { name, address } = updateLocationInput;
    const result = await this.locationsRepository
      .createQueryBuilder().update(Location).set({
        name,
        address
      })
      .where({ id })
      .returning(["name", "address", "id"]).execute()

    if (!result.affected) {
      throw new NotFoundException()
    }

    return result.raw[0]
  }

  remove(id: number) {
    return this.locationsRepository.delete(id)
  }
}
