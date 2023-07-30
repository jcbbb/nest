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

  private prefix(socket: ExtendedSocket, topic: string = ""): string {
    return socket.token.sub + topic
  }

  async handleConnection(socket: ExtendedSocket) {
    const { token } = socket.handshake.auth;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("jwt.secret")
      })

      socket.token = payload;
      socket.join(this.prefix(socket))
    } catch (err) {
      socket.disconnect()
    }
  }

  @SubscribeMessage("locationEditing")
  locationEditing(socket: ExtendedSocket, edit: LocationEdit) {
    socket.broadcast.to(this.prefix(socket, edit.topic)).emit("locationEditing", edit.update);
  }

  @SubscribeMessage("locationRemoved")
  removeLocation(socket: ExtendedSocket, data: LocationRemoved) {
    socket.broadcast.to(this.prefix(socket, data.topic)).emit("locationRemoved", data.id)
  }

  @SubscribeMessage("locationCreated")
  locationCreated(socket: ExtendedSocket, data: LocationCreated) {
    socket.broadcast.to(this.prefix(socket, data.topic)).emit("locationCreated", data.location)
  }

  @SubscribeMessage("locationUpdated")
  locationUpdated(socket: ExtendedSocket, data: LocationEdit) {
    socket.broadcast.to(this.prefix(socket, data.topic)).emit("locationUpdated", data.update)
  }

  @SubscribeMessage("subscribe")
  subscribe(socket: ExtendedSocket, topics: string[]) {
    for (const topic of topics) socket.join(this.prefix(socket, topic))
  }

  @SubscribeMessage("unsubscribe")
  unsubscribe(socket: ExtendedSocket, topics: string[]) {
    for (const topic of topics) socket.leave(this.prefix(socket, topic))
  }
}
