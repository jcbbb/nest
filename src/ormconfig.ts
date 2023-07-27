import { ConfigModule } from "@nestjs/config";
import { dbConfig } from "./config/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { join } from "path";

ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfig],
  envFilePath: join(process.cwd(), ".env." + process.env.NODE_ENV || "development"),
});

export default new DataSource({
  ...dbConfig(),
  entities: ['**/*.entity*{.js,.ts}'],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
  cli: {
    migrationsDir: join(process.cwd(), "src/migrations")
  },
} as DataSourceOptions)
