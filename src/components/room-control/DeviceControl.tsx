
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface DeviceControlProps {
  id: string;
  label: string;
  Icon: LucideIcon;
  type: "switch" | "button" | "sensor";
  isOn?: boolean; // For switch
  buttonText?: string; // For button
  sensorValue?: string | number; // For sensor
  sensorUnit?: string; // For sensor
  onToggle?: (id: string, newState: boolean) => void; // For switch
  onClick?: (id: string) => void; // For button
  isLoading?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined; // For button
}

export function DeviceControl({
  id,
  label,
  Icon,
  type,
  isOn,
  buttonText,
  sensorValue,
  sensorUnit,
  onToggle,
  onClick,
  isLoading = false,
  variant = "default",
}: DeviceControlProps) {
  const handleToggle = () => {
    if (onToggle && type === "switch") {
      onToggle(id, !isOn);
    }
  };

  const handleClick = () => {
    if (onClick && type === "button") {
      onClick(id);
    }
  };

  return (
    <Card className={cn("shadow-md transition-all duration-300", isLoading && "opacity-70 pointer-events-none")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{label}</CardTitle>
        <Icon className={cn("h-5 w-5", isOn ? "text-accent" : "text-muted-foreground")} />
      </CardHeader>
      <CardContent>
        {type === "switch" && (
          <div className="flex items-center space-x-2">
            <Switch
              id={id}
              checked={isOn}
              onCheckedChange={handleToggle}
              disabled={isLoading}
              aria-label={label}
            />
            <label htmlFor={id} className={cn("text-lg font-semibold", isOn ? "text-accent" : "text-foreground")}>
              {isOn ? "ON" : "OFF"}
            </label>
          </div>
        )}
        {type === "button" && buttonText && (
          <Button onClick={handleClick} disabled={isLoading} className="w-full" variant={variant}>
            {buttonText}
          </Button>
        )}
        {type === "sensor" && (
          <div className="text-2xl font-bold text-primary">
            {sensorValue}
            {sensorUnit && <span className="text-sm font-normal text-muted-foreground ml-1">{sensorUnit}</span>}
          </div>
        )}
        {isLoading && <p className="text-xs text-muted-foreground mt-1">Updating...</p>}
      </CardContent>
    </Card>
  );
}
