
"use client";

import { RoomControlPanel } from "@/components/room-control/RoomControlPanel";
import { mockBookings, mockRooms } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function RoomControlPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  const [roomName, setRoomName] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomImageUrl, setRoomImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push(`/login?redirect=/my-bookings/${bookingId}/control`);
        return;
      }

      const booking = mockBookings.find(b => b.id === bookingId && b.guestId === user.id);
      if (!booking) {
        setError("Booking not found or access denied.");
        setIsLoading(false);
        return;
      }
      
      const room = mockRooms.find(r => r.id === booking.roomId);
      if (!room) {
        setError("Room details associated with this booking could not be found.");
        setIsLoading(false);
        return;
      }

      setRoomName(room.name);
      setRoomId(room.id);
      setRoomImageUrl(room.imageUrl);
      setIsLoading(false);
    }
  }, [user, authLoading, router, bookingId]);


  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="lg:w-2/3">
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive">{error}</h1>
        <p className="mt-4 text-muted-foreground">
          Please check your booking details or contact support.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/my-bookings">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to My Bookings
          </Link>
        </Button>
      </div>
    );
  }
  
  if (!roomId || !roomName) { // Should be caught by error state, but as a safeguard
     return <div className="container mx-auto px-4 py-12 text-center">Error loading room information.</div>;
  }


  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/my-bookings">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to My Bookings
        </Link>
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/3 space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            {roomImageUrl && (
                <div className="relative aspect-video w-full mb-4 rounded-md overflow-hidden">
                    <Image src={roomImageUrl} alt={roomName} layout="fill" objectFit="cover" data-ai-hint="hotel room comfortable" />
                </div>
            )}
            <h1 className="text-3xl font-bold text-primary mb-2">{roomName}</h1>
            <p className="text-sm text-muted-foreground">Room ID: {roomId}</p>
            <p className="text-sm text-muted-foreground">Booking ID: {bookingId}</p>
          </div>
           {/* Could add more booking details here if needed */}
        </aside>

        <main className="lg:w-2/3">
          <RoomControlPanel roomId={roomId} bookingId={bookingId} />
        </main>
      </div>
    </div>
  );
}

// export async function generateMetadata({ params }: { params: { bookingId: string } }) {
//   // In a real app, fetch booking details to get room name for metadata
//   return {
//     title: `Room Control | SmartStay`,
//     description: `Control your room environment for booking ${params.bookingId}.`,
//   };
// }

