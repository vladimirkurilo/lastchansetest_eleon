
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'guest' | 'admin';
}

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  imageUrl: string;
  description: string;
  // Admin specific
  status?: 'Vacant' | 'Occupied' | 'Cleaning';
  isDoorLocked?: boolean;
  currentGuestId?: string | null;
}

export interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  roomName?: string; // For display purposes
  roomImageUrl?: string; // For display purposes
}

// Mirrored from protobuf definitions
export enum LightStates { On = 0, Off = 1 }
export enum DoorLockStates { Open = 0, Close = 1 }
export enum ChannelStates { ChannelOn = 0, ChannelOff = 1 }

export interface RoomControllerState {
  light_on: LightStates;
  door_lock: DoorLockStates;
  channel_1: ChannelStates;
  channel_2: ChannelStates;
  temperature: number;
  pressure: number;
  humidity: number;
}

// For set_state command
export enum ControllerCommands {
  LightOn = 0,
  LightOff = 1,
  DoorLockOpen = 2,
  DoorLockClose = 3,
  Channel1On = 4,
  Channel1Off = 5,
  Channel2On = 6,
  Channel2Off = 7,
}
