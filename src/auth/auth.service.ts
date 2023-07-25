import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthInput } from './dto/create-auth.input';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  async login(authInput: AuthInput) {
    const user = await this.usersService.findByUsername(authInput.username);
    const isValid = user.verifyPassword(authInput.password);
    if (!isValid) {
      throw new UnauthorizedException()
    }

    const payload = { sub: user.id, username: user.username }
    return { access_token: await this.jwtService.signAsync(payload) }
  }

  signup(authInput: AuthInput) {
    return `This action returns all auth`;
  }
}
