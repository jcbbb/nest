import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity()
@ObjectType()
export class Event {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  @OneToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column()
  @Field()
  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;

  @Column({ type: 'timestamptz' })
  @Field()
  start_at: Date;

  @Column({ type: 'timestamptz' })
  @Field()
  end_at: Date;
}
