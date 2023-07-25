import { Injectable } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { DecodedToken } from 'src/auth/interfaces/auth.interface';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) { }
  create(createLocationInput: CreateLocationInput, token: DecodedToken) {
    const { name, address } = createLocationInput;
    const entity = this.locationsRepository.create({
      name,
      address,
      created_by: token.sub
    });

    return this.locationsRepository.save(entity)
  }

  findAll() {
    return this.locationsRepository.find()
  }

  findOne(id: number) {
    return this.locationsRepository.findOne({ where: { id } })
  }

  update(id: number, updateLocationInput: UpdateLocationInput) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
