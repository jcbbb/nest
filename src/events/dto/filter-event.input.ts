import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterEventInput {
  @Field({ nullable: true })
  end_at: string;

  @Field({ nullable: true })
  start_at: string;

  @Field({ nullable: true })
  location_id: number;
}
