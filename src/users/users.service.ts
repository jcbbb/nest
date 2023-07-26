import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersReposity: Repository<User>,
  ) { }

  async create(createUserInput: CreateUserInput) {
    const { username, password } = createUserInput;
    const { identifiers } = await this.usersReposity
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        password: await hash(password)
      })
      .execute()

    return { username, id: identifiers[0].id }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.usersReposity.findOne({ where: { id } })
  }

  async findByUsername(username: string) {
    const user = await this.usersReposity.findOne({ where: { username } })
    if (!user) throw new NotFoundException(`User with ${username} not found`)
    return user;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
