import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity({ name: "events" })
@ObjectType()
export class Event {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 255 })
  @Field()
  title: string;

  @Column({ type: "text" })
  @Field()
  description: string;

  @Column()
  created_by: number;

  @Column()
  location_id: number;

  @Field()
  @OneToOne(() => User)
  @JoinColumn({ name: "created_by" })
  creator: User;

  @Field()
  @OneToOne(() => Location)
  @JoinColumn({ name: "location_id" })
  location: Location;

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable({
    name: "event_participants",
    joinColumn: { name: "event_id", referencedColumnName: "id", foreignKeyConstraintName: "fk_event_participants_event_id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id", foreignKeyConstraintName: "fk_event_participants_user_id" },
    synchronize: false
  })
  participants: User[]

  @Column({ type: 'timestamptz' })
  @Field()
  start_at: Date;

  @Column({ type: 'timestamptz' })
  @Field()
  end_at: Date;
}
