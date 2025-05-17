
"use client";

import type { RoomControllerState, ControllerCommands } from "@/lib/types";
import { LightStates, DoorLockStates, ChannelStates } from "@/lib/types";
import React, { useState, useEffect, useCallback } from "react";
import { DeviceControl } from "./DeviceControl";
import { Lightbulb, LightbulbOff, DoorOpen, DoorClosed, Zap, Thermometer, Droplets, Gauge, WifiOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RoomControlPanelProps {
  roomId: string;
  bookingId: string;
}

async function fetchRoomStateFromAPI(roomId: string): Promise<RoomControllerState> {
  console.log(`API Call: Fetching state for room ${roomId}`);
  const response = await fetch(`/api/room/${roomId}/state`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch room state" }));
    throw new Error(errorData.message || `Network response was not ok: ${response.statusText}`);
  }
  return response.json();
}

async function sendCommandToAPI(roomId: string, command: ControllerCommands): Promise<{ success: boolean; state?: RoomControllerState; message?: string }> {
  console.log(`API Call: Setting state for room ${roomId}, command: ${ControllerCommands[command]}`);
  const response = await fetch(`/api/room/${roomId}/command`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to send command" }));
    throw new Error(errorData.message || `Network response was not ok: ${response.statusText}`);
  }
  return response.json();
}


export function RoomControlPanel({ roomId, bookingId }: RoomControlPanelProps) {
  const [roomState, setRoomState] = useState<RoomControllerState | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchState = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, global: true }));
    setError(null);
    try {
      const state = await fetchRoomStateFromAPI(roomId);
      setRoomState(state);
    } catch (err) {
      console.error("Failed to fetch room state:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching room state.";
      setError(`Failed to connect to room controller. ${errorMessage}`);
      setRoomState(null);
      toast({
        title: "Connection Error",
        description: `Could not retrieve room status. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, global: false }));
    }
  }, [roomId, toast]);

  useEffect(() => {
    fetchState();
    const intervalId = setInterval(fetchState, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, [fetchState]);

  const handleControlAction = async (deviceId: string, command: ControllerCommands, successMessage: string) => {
    setLoadingStates(prev => ({ ...prev, [deviceId]: true }));
    try {
      const result = await sendCommandToAPI(roomId, command);
      if (result.success && result.state) {
        setRoomState(result.state);
        toast({ title: "Success", description: successMessage });
      } else {
        toast({ title: "Error", description: result.message || `Failed to update ${deviceId}.`, variant: "destructive" });
        // Optionally refetch state if command failed but didn't return new state
        fetchState();
      }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `An unknown error occurred while updating ${deviceId}.`;
        toast({ title: "Command Error", description: errorMessage, variant: "destructive" });
        fetchState(); // Refetch state on error
    } finally {
        setLoadingStates(prev => ({ ...prev, [deviceId]: false }));
    }
  };

  const handleToggle = (deviceId: string, newUiState: boolean) => {
    let command: ControllerCommands;
    let successMessage: string;

    switch (deviceId) {
      case "light":
        command = newUiState ? ControllerCommands.LightOn : ControllerCommands.LightOff;
        successMessage = `Light turned ${newUiState ? "ON" : "OFF"}.`;
        break;
      case "channel1":
        command = newUiState ? ControllerCommands.Channel1On : ControllerCommands.Channel1Off;
        successMessage = `Channel 1 turned ${newUiState ? "ON" : "OFF"}.`;
        break;
      case "channel2":
        command = newUiState ? ControllerCommands.Channel2On : ControllerCommands.Channel2Off;
        successMessage = `Channel 2 turned ${newUiState ? "ON" : "OFF"}.`;
        break;
      default:
        return;
    }
    handleControlAction(deviceId, command, successMessage);
  };
  
  const handleDoorLock = () => {
    if (!roomState) return;
    const isCurrentlyLocked = roomState.door_lock === DoorLockStates.Close;
    const command = isCurrentlyLocked ? ControllerCommands.DoorLockOpen : ControllerCommands.DoorLockClose;
    const successMessage = `Door ${isCurrentlyLocked ? "unlocked" : "locked"}.`;
    handleControlAction("doorLock", command, successMessage);
  };


  if (loadingStates.global && !roomState) {
     return (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Room Controls</CardTitle>
            <CardDescription>Accessing room systems...</CardDescription>
          </CardHeader>
          <CardContent className="animate-pulse">
            <div className="space-y-4">
              {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-20 bg-muted rounded-md" />)}
            </div>
          </CardContent>
        </Card>
     );
  }
  
  if (error && !roomState) { 
    return (
      <Alert variant="destructive" className="mb-6">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Controller Connection Error</AlertTitle>
        <AlertDescription>
          {error} Please ensure you are connected to the hotel network or try again later.
          <Button onClick={fetchState} variant="link" className="p-0 h-auto ml-1 text-destructive-foreground">Retry connection</Button>
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Room Controls</CardTitle>
        <CardDescription>Manage your room environment. Booking ID: {bookingId}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && !loadingStates.global && roomState && ( 
          <Alert variant="destructive" className="mb-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Connection Issue</AlertTitle>
            <AlertDescription>
              {error} Data might be outdated.
              <Button onClick={fetchState} variant="link" className="p-0 h-auto ml-1 text-destructive-foreground">Retry</Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DeviceControl
            id="light"
            label="Main Light"
            Icon={roomState?.light_on === LightStates.On ? Lightbulb : LightbulbOff}
            type="switch"
            isOn={roomState?.light_on === LightStates.On}
            onToggle={handleToggle}
            isLoading={loadingStates.light || loadingStates.global && !roomState}
          />
          <DeviceControl
            id="doorLock"
            label="Door Lock"
            Icon={roomState?.door_lock === DoorLockStates.Open ? DoorOpen : DoorClosed}
            type="button"
            buttonText={roomState?.door_lock === DoorLockStates.Open ? "Close Door" : "Open Door"}
            onClick={handleDoorLock}
            isLoading={loadingStates.doorLock || loadingStates.global && !roomState}
            variant={roomState?.door_lock === DoorLockStates.Open ? "destructive" : "default"}
          />
          <DeviceControl
            id="channel1"
            label="Channel 1 (e.g. Outlet)"
            Icon={Zap}
            type="switch"
            isOn={roomState?.channel_1 === ChannelStates.ChannelOn}
            onToggle={handleToggle}
            isLoading={loadingStates.channel1 || loadingStates.global && !roomState}
          />
          <DeviceControl
            id="channel2"
            label="Channel 2 (e.g. Fan)"
            Icon={Zap} // Consider a more specific icon if available
            type="switch"
            isOn={roomState?.channel_2 === ChannelStates.ChannelOn}
            onToggle={handleToggle}
            isLoading={loadingStates.channel2 || loadingStates.global && !roomState}
          />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground pt-4 border-t">Sensor Readings</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DeviceControl
            id="temperature"
            label="Temperature"
            Icon={Thermometer}
            type="sensor"
            sensorValue={roomState?.temperature?.toFixed(1)}
            sensorUnit="°C"
            isLoading={loadingStates.global && !roomState}
          />
          <DeviceControl
            id="humidity"
            label="Humidity"
            Icon={Droplets}
            type="sensor"
            sensorValue={roomState?.humidity?.toFixed(1)}
            sensorUnit="%"
            isLoading={loadingStates.global && !roomState}
          />
          <DeviceControl
            id="pressure"
            label="Pressure"
            Icon={Gauge}
            type="sensor"
            sensorValue={roomState?.pressure?.toFixed(1)}
            sensorUnit="hPa"
            isLoading={loadingStates.global && !roomState}
          />
        </div>
        <Button onClick={fetchState} variant="outline" className="w-full mt-4" disabled={loadingStates.global}>
          Refresh Room Status
        </Button>
      </CardContent>
    </Card>
  );
}
