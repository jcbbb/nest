import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { AuthInput } from './dto/create-auth.input';
import { Public } from 'src/auth/decorators/public.decorator';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Mutation(() => Auth)
  login(@Args('authInput') authInput: AuthInput) {
    return this.authService.login(authInput);
  }

  @Public()
  @Mutation(() => Auth)
  signup(@Args('authInput') authInput: AuthInput) {
    return this.authService.signup(authInput);
  }
}
