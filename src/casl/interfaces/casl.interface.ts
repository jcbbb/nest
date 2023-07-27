import { InferSubjects, MongoAbility } from "@casl/ability"
import { User } from "src/users/entities/user.entity"
import { Event } from "src/events/entities/event.entity"
import { Location } from "src/locations/entities/location.entity";

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

export type Subjects = InferSubjects<typeof User | typeof Event | typeof Location>
export type AppAbility = MongoAbility<[Action, Subjects]>
