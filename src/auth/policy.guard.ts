import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY, PolicyHandler } from "./decorators/policy.decorator";
import { GqlExecutionContext } from "@nestjs/graphql";
import { CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { AppAbility } from "src/casl/interfaces/casl.interface";

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || []
    const ctx = GqlExecutionContext.create(context).getContext();
    const ability = this.caslAbilityFactory.createForToken(ctx.token);

    ctx.userAbility = ability;
    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability))
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === "function") {
      return handler(ability)
    }

    return handler.handle(ability)
  }
}
