
"use client";

import type { Room, Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, MinusIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";


const bookingFormSchema = z.object({
  checkInDate: z.date({ required_error: "Check-in date is required." }),
  checkOutDate: z.date({ required_error: "Check-out date is required." }),
  numberOfGuests: z.number().min(1, "At least one guest is required.").max(10, "Maximum 10 guests."), // Max from room.capacity
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface RoomBookingFormProps {
  room: Room;
}

export function RoomBookingForm({ room }: RoomBookingFormProps) {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      numberOfGuests: 1,
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a room.",
        variant: "destructive",
      });
      router.push("/login?redirect=/rooms/" + room.id); // Redirect back to room page after login
      return;
    }

    const newBooking: Booking = {
      id: `booking-${Date.now().toString()}`, // Generate unique ID
      roomId: room.id,
      guestId: user.id,
      checkInDate: format(data.checkInDate, "yyyy-MM-dd"),
      checkOutDate: format(data.checkOutDate, "yyyy-MM-dd"),
      roomName: room.name,
      roomImageUrl: room.imageUrl,
    };

    try {
      let existingBookings: Booking[] = [];
      const storedBookings = localStorage.getItem("eleonUserBookings");
      if (storedBookings) {
        existingBookings = JSON.parse(storedBookings);
      }
      existingBookings.push(newBooking);
      localStorage.setItem("eleonUserBookings", JSON.stringify(existingBookings));
      
      toast({
        title: "Booking Successful!",
        description: `You've booked ${room.name} from ${format(data.checkInDate, "PPP")} to ${format(data.checkOutDate, "PPP")}.`,
        variant: "default",
      });
      router.push("/my-bookings");

    } catch (error) {
        console.error("Failed to save booking to localStorage:", error);
        toast({
            title: "Booking Failed",
            description: "Could not save your booking. Please try again.",
            variant: "destructive",
        });
    }
  };
  
  const handleGuestsChange = (increment: boolean) => {
    setGuests(prev => {
      const newGuests = increment ? prev + 1 : prev - 1;
      if (newGuests < 1) return 1;
      if (newGuests > room.capacity) {
        toast({
            title: "Guest Limit Reached",
            description: `This room can accommodate a maximum of ${room.capacity} guests.`,
            variant: "default"
        })
        return room.capacity;
      }
      setValue("numberOfGuests", newGuests, { shouldValidate: true });
      return newGuests;
    });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="checkInDate" className={cn(errors.checkInDate && "text-destructive")}>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !watch("checkInDate") && "text-muted-foreground",
                  errors.checkInDate && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch("checkInDate") ? format(watch("checkInDate")!, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch("checkInDate")}
                onSelect={(date) => {
                  setValue("checkInDate", date as Date, { shouldValidate: true });
                  setCheckInDate(date);
                  // If check-out date is before new check-in date, clear it
                  if (checkOutDate && date && date >= checkOutDate) {
                    setCheckOutDate(undefined);
                    setValue("checkOutDate", undefined as unknown as Date, { shouldValidate: true });
                  }
                }}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || (checkOutDate ? date >= checkOutDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.checkInDate && <p className="text-sm text-destructive mt-1">{errors.checkInDate.message}</p>}
        </div>
        <div>
          <Label htmlFor="checkOutDate" className={cn(errors.checkOutDate && "text-destructive")}>Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !watch("checkOutDate") && "text-muted-foreground",
                  errors.checkOutDate && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch("checkOutDate") ? format(watch("checkOutDate")!, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch("checkOutDate")}
                onSelect={(date) => {
                  setValue("checkOutDate", date as Date, { shouldValidate: true });
                  setCheckOutDate(date);
                }}
                disabled={(date) => (checkInDate ? date <= checkInDate : date < new Date(new Date().setHours(0,0,0,0)))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.checkOutDate && <p className="text-sm text-destructive mt-1">{errors.checkOutDate.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="numberOfGuests" className={cn(errors.numberOfGuests && "text-destructive")}>Number of Guests (Max: {room.capacity})</Label>
        <div className="flex items-center gap-2 mt-1">
            <Button type="button" variant="outline" size="icon" onClick={() => handleGuestsChange(false)} disabled={guests <= 1}>
                <MinusIcon className="h-4 w-4" />
            </Button>
            <Input 
                id="numberOfGuestsFromInput" // Changed id to avoid conflict with react-hook-form
                type="number"
                className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={guests}
                readOnly
                aria-label="Number of guests"
            />
             <input
              type="hidden"
              {...register("numberOfGuests", { valueAsNumber: true })}
              value={guests}
            />
            <Button type="button" variant="outline" size="icon" onClick={() => handleGuestsChange(true)} disabled={guests >= room.capacity}>
                <PlusIcon className="h-4 w-4" />
            </Button>
        </div>
        {errors.numberOfGuests && <p className="text-sm text-destructive mt-1">{errors.numberOfGuests.message}</p>}
      </div>

      <div>
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea
          id="specialRequests"
          placeholder="Any special requirements? (e.g., high floor, feather-free)"
          className="min-h-[100px]"
          {...register("specialRequests")}
        />
      </div>

      <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
        Confirm Booking
      </Button>
    </form>
  );
}

    