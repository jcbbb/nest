import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { AuthInput } from './dto/create-auth.input';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from 'src/users/entities/user.entity';
import { DecodedToken } from './interfaces/auth.interface';
import { UsersService } from 'src/users/users.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

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

  @Query(() => User)
  me(@Context("token") token: DecodedToken) {
    return this.usersService.findOne(token.sub)
  }
}
