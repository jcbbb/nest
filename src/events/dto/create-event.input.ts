import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  end_at: Date;

  @Field()
  start_at: Date;

  @Field()
  location_id: number;
}
