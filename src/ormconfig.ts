import { DataSource, DataSourceOptions } from "typeorm";
import { join } from "path";
import * as dotenv from "dotenv";

dotenv.config({
  path: join(process.cwd(), ".env." + (process.env.NODE_ENV || "development"))
})

export default new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URI,
  entities: ['**/*.entity*{.js,.ts}'],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
  cli: {
    migrationsDir: join(process.cwd(), "src/migrations")
  },
} as DataSourceOptions)
