
import { NextResponse } from 'next/server';
import { mockRoomControllerStates } from '@/lib/mock-data';
import type { RoomControllerState } from '@/lib/types';
import { LightStates, DoorLockStates, ChannelStates } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const roomId = params.roomId;

  // =====================================================================================
  // TODO: REPLACE THIS WITH ACTUAL MICROCONTROLLER COMMUNICATION LOGIC
  // This section currently uses mock data. You need to implement the code
  // to communicate with your actual microcontroller to get its real state.
  // This might involve:
  // - HTTP requests to the microcontroller's IP address if it has an HTTP server.
  // - Serial communication if it's connected directly (requires a backend bridge).
  // - MQTT messages if it uses an MQTT broker.
  // - Other specific protocols your microcontroller uses.
  //
  // The 'roomState' variable should be populated with the actual data from the device.
  // =====================================================================================

  const roomState: RoomControllerState | undefined = mockRoomControllerStates[roomId];

  if (roomState) {
    return NextResponse.json(roomState);
  } else {
    // Fallback to a default 'off' state if a specific room isn't in mock data
    // In a real scenario, you might return a 404 or a specific error state.
    console.warn(`API: No mock state for room ${roomId}, returning default off state. THIS SHOULD BE HANDLED BY REAL HARDWARE INTEGRATION.`);
    const defaultState: RoomControllerState = {
      light_on: LightStates.Off,
      door_lock: DoorLockStates.Close,
      channel_1: ChannelStates.ChannelOff,
      channel_2: ChannelStates.ChannelOff,
      temperature: 20,
      pressure: 1000,
      humidity: 50,
    };
    // Optionally, add this default state to mock data for subsequent calls in demo
    // mockRoomControllerStates[roomId] = defaultState; 
    return NextResponse.json(defaultState);
    // Or return an error:
    // return NextResponse.json({ message: `Room with ID ${roomId} not found or controller offline.` }, { status: 404 });
  }
}
