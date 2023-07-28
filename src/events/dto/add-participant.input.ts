
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddParticipantInput {
  @Field()
  id: number;

  @Field()
  event: number;
}
