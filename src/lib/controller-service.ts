
'use server';
import * as net from 'net';
import * as protobuf from 'protobufjs';
import path from 'path';
import type { RoomControllerState, ControllerCommands } from '@/lib/types';
import { LightStates, DoorLockStates, ChannelStates } from '@/lib/types';

const CONTROLLER_IP = process.env.CONTROLLER_IP || '127.0.0.1'; // Fallback to localhost if not set
const CONTROLLER_PORT = parseInt(process.env.CONTROLLER_PORT || '7000', 10);
const SOCKET_TIMEOUT = 5000; // 5 seconds

let protoRoot: protobuf.Root | null = null;
let ClientMessage: protobuf.Type | null = null;
let ControllerResponse: protobuf.Type | null = null;
let ProtoDeviceControlCommands: protobuf.Enum | null = null;

async function loadProtos(): Promise<void> {
  if (!protoRoot) {
    const protoPath = path.join(process.cwd(), 'src', 'lib', 'controller.proto');
    protoRoot = await protobuf.load(protoPath);
    ClientMessage = protoRoot.lookupType('ClientMessage');
    ControllerResponse = protoRoot.lookupType('ControllerResponse');
    ProtoDeviceControlCommands = protoRoot.lookupEnum('DeviceControlCommands');
    if (!ClientMessage || !ControllerResponse || !ProtoDeviceControlCommands) {
      throw new Error('Failed to load Protobuf message types or enums.');
    }
  }
}

function connectToController(): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(SOCKET_TIMEOUT);

    socket.connect(CONTROLLER_PORT, CONTROLLER_IP, () => {
      resolve(socket);
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error(`Socket timeout connecting to ${CONTROLLER_IP}:${CONTROLLER_PORT}`));
    });

    socket.on('error', (err) => {
      socket.destroy();
      reject(new Error(`Socket error connecting to ${CONTROLLER_IP}:${CONTROLLER_PORT}: ${err.message}`));
    });
  });
}

async function sendProtoMessage(socket: net.Socket, payload: protobuf.Message): Promise<any> {
  if (!ClientMessage || !ControllerResponse) {
    await loadProtos();
    if (!ClientMessage || !ControllerResponse) { // Double check after load
        throw new Error('Protobuf types not loaded for sending message.');
    }
  }
  const errMsg = ClientMessage.verify(payload);
  if (errMsg) throw Error(errMsg);

  const buffer = ClientMessage.encode(payload).finish();
  socket.write(buffer);

  return new Promise((resolve, reject) => {
    socket.once('data', (data) => {
      try {
        const decodedResponse = ControllerResponse!.decode(data);
        resolve(decodedResponse);
      } catch (e) {
        reject(new Error(`Failed to decode controller response: ${(e as Error).message}`));
      }
    });
    socket.once('timeout', () => reject(new Error('Socket timeout waiting for response')));
    socket.once('error', (err) => reject(new Error(`Socket error during communication: ${err.message}`)));
    socket.once('close', () => reject(new Error('Connection closed prematurely')));
  });
}

// Helper to map proto enums to TypeScript enums
function mapProtoToTsState(protoState: any): RoomControllerState {
  if (!protoState) {
      throw new Error('Received undefined state from controller');
  }
  return {
    light_on: protoState.light_on === 0 ? LightStates.On : LightStates.Off, // Assuming 0 is On for LightStatesEnum
    door_lock: protoState.door_lock === 0 ? DoorLockStates.Open : DoorLockStates.Close, // Assuming 0 is Open for DoorLockStatesEnum
    channel_1: protoState.channel_1 === 0 ? ChannelStates.ChannelOn : ChannelStates.ChannelOff, // Assuming 0 is ChannelOn for ChannelStatesEnum
    channel_2: protoState.channel_2 === 0 ? ChannelStates.ChannelOn : ChannelStates.ChannelOff, // Assuming 0 is ChannelOn for ChannelStatesEnum
    temperature: protoState.temperature || 0,
    pressure: protoState.pressure || 0,
    humidity: protoState.humidity || 0,
  };
}


export async function getControllerDeviceState(): Promise<RoomControllerState> {
  await loadProtos();
  let socket: net.Socket | null = null;
  try {
    socket = await connectToController();
    const clientMessage = { get_state: {} }; // Empty object for GetStateRequest
    const response = await sendProtoMessage(socket, ClientMessage!.create(clientMessage)) as any;

    if (response && response.state) {
      return mapProtoToTsState(response.state);
    } else {
      throw new Error('Invalid or missing state in controller response.');
    }
  } catch (error) {
    console.error('Error in getControllerDeviceState:', error);
    throw error; // Re-throw to be handled by API route
  } finally {
    if (socket) socket.destroy();
  }
}

export async function setControllerDeviceState(command: ControllerCommands): Promise<RoomControllerState> {
  await loadProtos();
  if (!ProtoDeviceControlCommands) {
      throw new Error('Protobuf DeviceControlCommands enum not loaded.');
  }

  let socket: net.Socket | null = null;
  try {
    socket = await connectToController();
    
    // The command parameter is already the numeric value from ControllerCommands enum
    // which directly maps to DeviceControlCommands enum in proto.
    const protoCommandValue = command as number; 

    const clientMessagePayload = { set_state: { command: protoCommandValue } };
    const response = await sendProtoMessage(socket, ClientMessage!.create(clientMessagePayload)) as any;

    if (response && response.status === 0) { // Statuses.Ok = 0
      // After setting state, fetch the new state to return it
      // This mimics the behavior where the controller might return the new state or just OK.
      // If controller returns new state directly with set_state response, adapt this.
      // For now, we explicitly call get_state.
      const getMessage = { get_state: {} };
      const stateResponse = await sendProtoMessage(socket, ClientMessage!.create(getMessage)) as any;
       if (stateResponse && stateResponse.state) {
        return mapProtoToTsState(stateResponse.state);
      } else {
        throw new Error('Failed to retrieve state after command execution or invalid state in response.');
      }
    } else if (response && response.status === 1) { // Statuses.Error = 1
      throw new Error(`Controller reported an error for command ${ControllerCommands[command]}.`);
    } 
     else {
      throw new Error(`Invalid or no status in response after command ${ControllerCommands[command]}. Response: ${JSON.stringify(response)}`);
    }
  } catch (error) {
    console.error(`Error in setControllerDeviceState (command: ${ControllerCommands[command]}):`, error);
    throw error; // Re-throw to be handled by API route
  } finally {
    if (socket) socket.destroy();
  }
}
