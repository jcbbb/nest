import { registerAs } from "@nestjs/config";

export const httpConfig = registerAs("http", () => {
  const port = Number(process.env.PORT);
  return {
    port: isNaN(port) ? 3000 : port
  }
});

export const redisConfig = registerAs("redis", () => {
  const port = Number(process.env.REDIS_PORT);
  return {
    host: process.env.REDIS_HOST || "localhost",
    port: isNaN(port) ? 6379 : port
  }
});

export const dbConfig = registerAs("database", () => {
  return {
    type: "postgres",
    url: process.env.POSTGRES_URI,
    autoLoadEntities: true,
  }
});

export const jwtConfig = registerAs("jwt", () => {
  return {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRATION }
  }
});

