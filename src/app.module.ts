import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { LocationsModule } from './locations/locations.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { dbConfig, httpConfig, redisConfig } from './config/config';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      includeStacktraceInErrorResponses: false,
      context: ({ req, res }) => ({ req, res }),
      installSubscriptionHandlers: true,
      introspection: true,
      playground: {
        subscriptionEndpoint: "/subscriptions"
      },
      subscriptions: {
        "graphql-ws": {
          path: "/subscriptions",
        },
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, httpConfig, redisConfig],
      envFilePath: join(process.cwd(), ".env." + process.env.NODE_ENV || "development"),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get("database"),
      inject: [ConfigService],
    }),
    EventsModule,
    LocationsModule,
    UsersModule,
    AuthModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
