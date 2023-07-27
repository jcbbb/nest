import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);
  app.connectMicroservice(configService.get("redis"), { inheritAppConfig: true });
  await app.startAllMicroservices();

  await app.listen(configService.get("http.port"));
}

bootstrap();
