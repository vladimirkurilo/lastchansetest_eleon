
import { NextResponse } from 'next/server';
import { getControllerDeviceState } from '@/lib/controller-service';
import type { RoomControllerState } from '@/lib/types';
import { LightStates, DoorLockStates, ChannelStates } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  // const roomId = params.roomId; // roomId can be used later for multi-controller setups

  try {
    const roomState = await getControllerDeviceState();
    return NextResponse.json(roomState);
  } catch (error) {
    console.error(`API State GET Error for room ${params.roomId}:`, error);
    // Return a default 'error' or 'unknown' state to the client
    // to prevent UI crashes and indicate a problem.
    const errorState: RoomControllerState = {
      light_on: LightStates.Off, // Default to off or an 'unknown' state
      door_lock: DoorLockStates.Close,
      channel_1: ChannelStates.ChannelOff,
      channel_2: ChannelStates.ChannelOff,
      temperature: -1, // Indicate error or unavailable
      pressure: -1,
      humidity: -1,
    };
    return NextResponse.json(
        { ...errorState, error: `Failed to get room state: ${(error as Error).message}` }, 
        { status: 500 }
    );
  }
}
