import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Event } from "src/events/entities/event.entity";
import { Location } from "src/locations/entities/location.entity";
import { DecodedToken } from "src/auth/interfaces/auth.interface";

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

type Subjects = InferSubjects<typeof User | typeof Event | typeof Location>
export type AppAbility = Ability<[Action, Subjects]>


@Injectable()
export class CaslAbilityFactory {
  createForToken(token: DecodedToken) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    can(Action.Update, Event, { created_by: token.sub });
    can(Action.Update, Location, { created_by: token.sub });
    can(Action.Delete, Event, { created_by: token.sub });
    can(Action.Delete, Location, { created_by: token.sub });
    can(Action.Read, Event, { created_by: token.sub });
    can(Action.Read, Location, { created_by: token.sub });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
    })
  }
}
