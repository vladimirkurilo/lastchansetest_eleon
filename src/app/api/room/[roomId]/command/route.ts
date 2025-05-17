
import { NextResponse } from 'next/server';
import { setControllerDeviceState } from '@/lib/controller-service';
import type { ControllerCommands, RoomControllerState } from '@/lib/types';
import { LightStates, DoorLockStates, ChannelStates } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  // const roomId = params.roomId; // roomId can be used later for multi-controller setups
  let commandValue: number;

  try {
    const body = await request.json();
    commandValue = body.command as number; // Directly use the number from the enum

    if (typeof commandValue !== 'number' || !Object.values(ControllerCommands).includes(commandValue as ControllerCommands)) {
      return NextResponse.json({ success: false, message: 'Invalid or missing command.' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const newState = await setControllerDeviceState(commandValue as ControllerCommands);
    return NextResponse.json({ success: true, state: newState });
  } catch (error) {
    console.error(`API Command POST Error for room ${params.roomId}, command ${ControllerCommands[commandValue]}:`, error);
     // Return a default 'error' or 'unknown' state to the client
    const errorState: RoomControllerState = {
      light_on: LightStates.Off,
      door_lock: DoorLockStates.Close,
      channel_1: ChannelStates.ChannelOff,
      channel_2: ChannelStates.ChannelOff,
      temperature: -1,
      pressure: -1,
      humidity: -1,
    };
    return NextResponse.json(
        { success: false, message: `Failed to execute command: ${(error as Error).message}`, state: errorState }, 
        { status: 500 }
    );
  }
}
