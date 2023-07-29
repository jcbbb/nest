import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ClientToServerEvents, ExtendedSocket, LocationCreated, LocationEdit, LocationRemoved, ServerToClientEvents } from "./interfaces/socket.interface";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: true
})

export class SocketGateway implements OnGatewayConnection {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) { }

  @WebSocketServer()
  public server: Server<ClientToServerEvents, ServerToClientEvents>;
  private prefix: string = "";

  private prefixTopic(topic: string): string {
    return this.prefix + topic
  }

  async handleConnection(socket: ExtendedSocket) {
    const { token } = socket.handshake.auth;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("jwt.secret")
      })

      socket.data
      socket.token = payload;
      this.prefix = payload.sub;
    } catch (err) {
      socket.disconnect()
    }
  }

  @SubscribeMessage("locationEditing")
  locationEditing(socket: ExtendedSocket, edit: LocationEdit) {
    socket.broadcast.to(this.prefixTopic(edit.topic)).emit("locationEditing", edit.update);
  }

  @SubscribeMessage("locationRemoved")
  removeLocation(socket: ExtendedSocket, data: LocationRemoved) {
    socket.broadcast.to(this.prefixTopic(data.topic)).emit("locationRemoved", data.id)
  }

  @SubscribeMessage("locationCreated")
  locationCreated(socket: ExtendedSocket, data: LocationCreated) {
    socket.broadcast.to(this.prefixTopic(data.topic)).emit("locationCreated", data.location)
  }


  @SubscribeMessage("subscribe")
  subscribe(socket: ExtendedSocket, topics: string[]) {
    for (const topic of topics) socket.join(this.prefixTopic(topic))
  }

  @SubscribeMessage("unsubscribe")
  unsubscribe(socket: ExtendedSocket, topics: string[]) {
    for (const topic of topics) socket.leave(this.prefixTopic(topic))
  }
}
