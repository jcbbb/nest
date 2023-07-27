import { Injectable } from "@nestjs/common";
import { AbilityBuilder, ExtractSubjectType, MongoAbility, createMongoAbility } from "@casl/ability";
import { Event } from "src/events/entities/event.entity";
import { Location } from "src/locations/entities/location.entity";
import { DecodedToken } from "src/auth/interfaces/auth.interface";
import { Action, Subjects } from "./interfaces/casl.interface";

@Injectable()
export class CaslAbilityFactory {
  createForToken(token?: DecodedToken) {
    const { can, build } = new AbilityBuilder<
      MongoAbility<[Action, Subjects]>
    >(createMongoAbility);

    can(Action.Update, Event, { created_by: token.sub });
    can(Action.Update, Location, { created_by: token.sub });
    can(Action.Delete, Event, { created_by: token.sub });
    can(Action.Delete, Location, { created_by: token.sub });
    can(Action.Read, Event, { created_by: token.sub });
    can(Action.Read, Location, { created_by: token.sub });
    can(Action.Create, Location);
    can(Action.Create, Event);

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
    })
  }
}
