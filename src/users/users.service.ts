import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersReposity: Repository<User>,
  ) { }

  async create(createUserInput: CreateUserInput) {
    const { username, password } = createUserInput;
    const entity = this.usersReposity.create({
      username,
      password
    });

    return this.usersReposity.save(entity);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.usersReposity.findOne({ where: { id } })
  }

  findByUsername(username: string) {
    return this.usersReposity.findOne({ where: { username } })
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
