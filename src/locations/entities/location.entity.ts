import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: "locations" })
@ObjectType()
export class Location {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 255 })
  @Field()
  name: string;

  @Column()
  created_by: number;

  @Field()
  @OneToOne(() => User)
  @JoinColumn({ name: "created_by" })
  creator: User;

  @Column({ length: 255 })
  @Field()
  address: string;

  @Column({ length: 255 })
  @Field()
  status: string;
}

@ObjectType()
export class DeletedLocation {
  @Field(() => Int)
  id: number;
}
