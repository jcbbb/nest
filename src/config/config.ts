import { registerAs } from "@nestjs/config";

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
