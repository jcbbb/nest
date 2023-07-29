import { IoAdapter } from "@nestjs/platform-socket.io";
import { Redis } from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";
import { ServerOptions } from "socket.io";
import { ConfigService } from "@nestjs/config";
import { INestApplicationContext } from "@nestjs/common";

export class RedisIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private readonly configService: ConfigService
  ) {
    super(app)
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pub = new Redis(this.configService.get("redis"));
    const sub = pub.duplicate();

    this.adapterConstructor = createAdapter(pub, sub);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
