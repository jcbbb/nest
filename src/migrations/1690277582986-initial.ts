import { MigrationInterface, QueryRunner } from "typeorm"

export class Initial1690277582986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table if not exists users (
        id serial primary key,
        username varchar(255) unique not null,
        password varchar(255) not null
      );
      
      create table if not exists locations (
        id serial primary key,
        name varchar(255) not null,
        address varchar(255) not null,
        created_y int not null,

        constraint fk_users_id foreign key (created_by) references users(id) on delete cascade
      );

      create table if not exists events (
        id serial primary key,
        title varchar(255) not null,
        description text not null,
        end_at timestamptz not null,
        start_at timestamptz not null,
        created_by int not null,
        location_id int not null,
        constraint fk_events_creator foreign key (created_by) references users(id) on delete cascade,
        constraint fk_events_location foreign key (location_id) references locations(id) on delete cascade
      );

      create table if not exists event_participants (
        event_id int not null,
        user_id int not null,
        constraint fk_users_id foreign key (user_id) references users(id) on delete cascade,
        constraint fk_events_id foreign key (event_id) references events(id) on delete cascade,
        constraint uq_user_id_event_id unique(event_id, user_id)
      );
    `)

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table if exists users cascade;
      drop table if exists events cascade;
      drop table if exists locations cascade;
      drop table if exists event_participants cascade;
    `)

  }

}
