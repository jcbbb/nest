import { Injectable } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';

@Injectable()
export class AuthService {
  login(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  signup() {
    return `This action returns all auth`;
  }
}
