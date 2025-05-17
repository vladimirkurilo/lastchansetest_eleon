
import { RoomCard } from "@/components/rooms/RoomCard";
import { mockRooms } from "@/lib/mock-data";
import type { Room } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

// This would typically be a server component fetching data
async function getRooms(): Promise<Room[]> {
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => resolve(mockRooms), 500));
}

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Explore Our Rooms</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Find the perfect accommodation for your stay at ELEON. Each room is designed for comfort and convenience.
        </p>
      </div>
      
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center p-4 bg-card rounded-lg shadow">
        <div className="relative flex-grow w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Search rooms by name, type..." className="pl-10 w-full" />
        </div>
        <Button variant="outline" className="bg-card/80 hover:bg-card">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No rooms available at the moment. Please check back later.</p>
        </div>
      )}

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Can&apos;t find what you&apos;re looking for?</h2>
        <p className="mt-2 text-muted-foreground">Contact our support team for personalized assistance.</p>
        <Button variant="link" className="mt-4 text-primary text-lg">Contact Support</Button>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Available Rooms | ELEON',
  description: 'Browse and book available rooms at ELEON hotel.',
};
