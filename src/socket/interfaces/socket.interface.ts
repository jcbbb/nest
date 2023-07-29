import { Socket } from "socket.io";
import { DecodedToken } from "src/auth/interfaces/auth.interface";
import { Location } from "src/locations/interfaces/location.interface";
import { Event } from "src/events/entities/event.entity";

export interface ExtendedSocket extends Socket {
  token: DecodedToken
}

export type LocationEdit = {
  topic: string,
  update: Pick<Location, "name" | "address">
}

export type LocationRemoved = {
  topic: string,
  id: number;
}

export type LocationCreated = {
  topic: string,
  location: Location
}

export interface ClientToServerEvents {
  subscribe: (topics: []) => void;
  unsubscribe: (topics: []) => void;
  locationEditing: (edit: LocationEdit) => void;
}

export interface ServerToClientEvents {
  locationCreated: (location: Location) => void
  locationRemoved: (id: number) => void
  locationUpdated: (location: Pick<Location, "status" | "id">) => void
  eventCreated: () => Event
  eventRemoved: () => number
}
