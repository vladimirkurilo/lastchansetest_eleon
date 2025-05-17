import type { Room, Booking, User, RoomControllerState } from '@/lib/types';
import { LightStates, DoorLockStates, ChannelStates } from '@/lib/types';

export const mockUsers: User[] = [
  { id: 'guest1', email: 'guest@example.com', name: 'John Doe', role: 'guest' },
  { id: 'admin1', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
];

export const mockRooms: Room[] = [
  {
    id: '101',
    name: 'Sunset View Suite',
    type: 'Suite',
    capacity: 2,
    pricePerNight: 250,
    amenities: ['King Bed', 'Ocean View', 'Balcony', 'Wi-Fi', 'Mini Bar'],
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'A luxurious suite offering breathtaking sunset views over the ocean. Perfect for a romantic getaway.',
    status: 'Vacant',
    isDoorLocked: true,
  },
  {
    id: '102',
    name: 'City Lights Deluxe',
    type: 'Deluxe Room',
    capacity: 2,
    pricePerNight: 180,
    amenities: ['Queen Bed', 'City View', 'Work Desk', 'Wi-Fi'],
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'A modern deluxe room with stunning views of the city skyline. Ideal for business travelers.',
    status: 'Occupied',
    isDoorLocked: false,
    currentGuestId: 'guest1',
  },
  {
    id: '201',
    name: 'Garden Oasis Twin',
    type: 'Twin Room',
    capacity: 2,
    pricePerNight: 150,
    amenities: ['Two Single Beds', 'Garden View', 'Wi-Fi', 'Coffee Maker'],
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'A peaceful twin room overlooking our serene gardens. Great for friends traveling together.',
    status: 'Cleaning',
    isDoorLocked: true,
  },
  {
    id: '202',
    name: 'Family Connect Room',
    type: 'Family Room',
    capacity: 4,
    pricePerNight: 320,
    amenities: ['King Bed', 'Bunk Beds', ' interconnecting door', 'Wi-Fi', 'Smart TV'],
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Spacious family room with connecting options, ensuring comfort for the whole family.',
    status: 'Vacant',
    isDoorLocked: true,
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking1',
    roomId: '102',
    guestId: 'guest1',
    checkInDate: '2024-08-15',
    checkOutDate: '2024-08-18',
    roomName: mockRooms.find(r => r.id === '102')?.name,
    roomImageUrl: mockRooms.find(r => r.id === '102')?.imageUrl,
  },
  {
    id: 'booking2',
    roomId: '101',
    guestId: 'guest1',
    checkInDate: '2024-09-01',
    checkOutDate: '2024-09-05',
    roomName: mockRooms.find(r => r.id === '101')?.name,
    roomImageUrl: mockRooms.find(r => r.id === '101')?.imageUrl,
  },
];

export const mockRoomControllerStates: Record<string, RoomControllerState> = {
  '101': {
    light_on: LightStates.Off,
    door_lock: DoorLockStates.Close,
    channel_1: ChannelStates.ChannelOff,
    channel_2: ChannelStates.ChannelOff,
    temperature: 22.5,
    pressure: 1012.5,
    humidity: 45.0,
  },
  '102': {
    light_on: LightStates.On,
    door_lock: DoorLockStates.Open,
    channel_1: ChannelStates.ChannelOn,
    channel_2: ChannelStates.ChannelOff,
    temperature: 24.0,
    pressure: 1010.0,
    humidity: 50.2,
  },
   '201': {
    light_on: LightStates.Off,
    door_lock: DoorLockStates.Close,
    channel_1: ChannelStates.ChannelOff,
    channel_2: ChannelStates.ChannelOff,
    temperature: 21.0,
    pressure: 1015.0,
    humidity: 55.0,
  },
  '202': {
    light_on: LightStates.On,
    door_lock: DoorLockStates.Close,
    channel_1: ChannelStates.ChannelOn,
    channel_2: ChannelStates.ChannelOn,
    temperature: 23.0,
    pressure: 1009.0,
    humidity: 48.0,
  },
};
