
import { NextResponse } from 'next/server';
import { mockRoomControllerStates } from '@/lib/mock-data';
import type { RoomControllerState, ControllerCommands } from '@/lib/types';
import { LightStates, DoorLockStates, ChannelStates } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const roomId = params.roomId;
  let command: ControllerCommands;

  try {
    const body = await request.json();
    command = body.command as ControllerCommands;

    if (command === undefined || !Object.values(ControllerCommands).includes(command as ControllerCommands)) {
      return NextResponse.json({ success: false, message: 'Invalid or missing command.' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }
  

  // =====================================================================================
  // TODO: REPLACE THIS WITH ACTUAL MICROCONTROLLER COMMUNICATION LOGIC
  // This section currently modifies mock data. You need to implement the code
  // to send the 'command' to your actual microcontroller and get its new state.
  //
  // After sending the command, you should ideally:
  // 1. Receive confirmation from the microcontroller.
  // 2. Read the new state from the microcontroller.
  // 3. Update 'currentRoomState' with this new real state.
  // =====================================================================================

  let currentRoomState: RoomControllerState | undefined = mockRoomControllerStates[roomId];

  if (!currentRoomState) {
    // If room doesn't exist in mock, initialize with a default state for the demo
    // In a real scenario, this might be an error or handled by the hardware returning its initial state
    console.warn(`API Command: No mock state for room ${roomId}, initializing with default. THIS SHOULD BE HANDLED BY REAL HARDWARE INTEGRATION.`);
    currentRoomState = {
      light_on: LightStates.Off,
      door_lock: DoorLockStates.Close,
      channel_1: ChannelStates.ChannelOff,
      channel_2: ChannelStates.ChannelOff,
      temperature: 20,
      pressure: 1000,
      humidity: 50,
    };
    mockRoomControllerStates[roomId] = currentRoomState;
  }
  
  // Simulate updating the state based on the command (update this with real device feedback)
  switch (command) {
    case ControllerCommands.LightOn:
      currentRoomState.light_on = LightStates.On;
      break;
    case ControllerCommands.LightOff:
      currentRoomState.light_on = LightStates.Off;
      break;
    case ControllerCommands.DoorLockOpen:
      currentRoomState.door_lock = DoorLockStates.Open;
      break;
    case ControllerCommands.DoorLockClose:
      currentRoomState.door_lock = DoorLockStates.Close;
      break;
    case ControllerCommands.Channel1On:
      currentRoomState.channel_1 = ChannelStates.ChannelOn;
      break;
    case ControllerCommands.Channel1Off:
      currentRoomState.channel_1 = ChannelStates.ChannelOff;
      break;
    case ControllerCommands.Channel2On:
      currentRoomState.channel_2 = ChannelStates.ChannelOn;
      break;
    case ControllerCommands.Channel2Off:
      currentRoomState.channel_2 = ChannelStates.ChannelOff;
      break;
    default:
      return NextResponse.json({ success: false, message: 'Unknown command.' }, { status: 400 });
  }

  // Update the mock state
  mockRoomControllerStates[roomId] = currentRoomState;

  // Return success and the new (mocked) state
  return NextResponse.json({ success: true, state: currentRoomState });
}
