
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { mockBookings, mockRooms } from "@/lib/mock-data";
import type { Booking, Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, BedDouble, KeyRound, ListFilter, Search } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface EnrichedBooking extends Booking {
  roomDetails?: Room;
}

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/my-bookings");
    } else if (user) {
      let userBookingsData: Booking[] = [];
      const storedBookings = localStorage.getItem("eleonUserBookings");
      
      if (storedBookings) {
        try {
          const allBookings: Booking[] = JSON.parse(storedBookings);
          userBookingsData = allBookings.filter(b => b.guestId === user.id);
        } catch (e) {
          console.error("Failed to parse bookings from localStorage", e);
          // Fallback to mockBookings if localStorage is corrupted
          userBookingsData = mockBookings.filter(b => b.guestId === user.id);
        }
      } else {
        // Fallback to initial mock data if nothing in localStorage
        userBookingsData = mockBookings.filter(b => b.guestId === user.id);
      }
      
      const enriched = userBookingsData.map(booking => ({
        ...booking,
        roomDetails: mockRooms.find(r => r.id === booking.roomId),
      }));
      setBookings(enriched);
      setIsLoading(false);
    }
  }, [user, authLoading, router]);

  const filteredBookings = bookings.filter(booking => {
    const roomName = booking.roomDetails?.name || "";
    const roomType = booking.roomDetails?.type || "";
    const bookingId = booking.id;
    const searchTermLower = searchTerm.toLowerCase();

    return roomName.toLowerCase().includes(searchTermLower) ||
           roomType.toLowerCase().includes(searchTermLower) ||
           bookingId.toLowerCase().includes(searchTermLower);
  });

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-[200px] lg:w-[300px]" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="shadow-lg">
              <Skeleton className="aspect-video w-full rounded-t-lg" />
              <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-12 text-center">Please log in to view your bookings.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Bookings</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
                type="search" 
                placeholder="Search bookings..." 
                className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" />Filter</Button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg shadow-md">
          <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground">
            {bookings.length > 0 && searchTerm ? "No Bookings Match Your Search" : "No Bookings Yet"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {bookings.length > 0 && searchTerm 
              ? "Try a different search term." 
              : "You haven't made any bookings. Ready to plan your next stay?"
            }
          </p>
          {!(bookings.length > 0 && searchTerm) && (
            <Button asChild className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/rooms">Explore Rooms</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              {booking.roomDetails?.imageUrl && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={booking.roomDetails.imageUrl}
                    alt={booking.roomDetails.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                    data-ai-hint="hotel room view"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl text-primary">{booking.roomDetails?.name || 'Room Details Unavailable'}</CardTitle>
                <CardDescription className="text-sm">Booking ID: {booking.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm flex-grow">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {format(parseISO(booking.checkInDate), "MMM dd, yyyy")} - {format(parseISO(booking.checkOutDate), "MMM dd, yyyy")}
                  </span>
                </div>
                {booking.roomDetails && (
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-muted-foreground" />
                    <span>{booking.roomDetails.type} - {booking.roomDetails.capacity} Guests</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={`/my-bookings/${booking.id}/control`}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Room Controls
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

    