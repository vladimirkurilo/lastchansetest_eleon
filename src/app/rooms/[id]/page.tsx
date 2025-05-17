
import Image from "next/image";
import { mockRooms } from "@/lib/mock-data";
import type { Room } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BedDouble, Users, Tag, Wifi, Wind, Tv, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { RoomBookingForm } from "@/components/rooms/RoomBookingForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// This would typically be a server component fetching data
async function getRoomById(id: string): Promise<Room | undefined> {
  // Simulate API call
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockRooms.find((room) => room.id === id)), 300)
  );
}

interface AmenityIconProps {
  amenity: string;
}

function AmenityIcon({ amenity }: AmenityIconProps) {
  const lowerAmenity = amenity.toLowerCase();
  if (lowerAmenity.includes("wi-fi")) return <Wifi className="h-5 w-5 text-primary" />;
  if (lowerAmenity.includes("air conditioning") || lowerAmenity.includes("a/c")) return <Wind className="h-5 w-5 text-primary" />;
  if (lowerAmenity.includes("tv") || lowerAmenity.includes("television")) return <Tv className="h-5 w-5 text-primary" />;
  if (lowerAmenity.includes("mini bar") || lowerAmenity.includes("kitchen")) return <UtensilsCrossed className="h-5 w-5 text-primary" />;
  return <CheckCircle2 className="h-5 w-5 text-primary" />;
}


export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  const room = await getRoomById(params.id);

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold">Room Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The room you are looking for does not exist or is no longer available.
        </p>
        <Button asChild variant="link" className="mt-6 text-primary">
          <Link href="/rooms">Back to Rooms</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/rooms">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to All Rooms
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="p-0">
              <Image
                src={room.imageUrl}
                alt={room.name}
                width={1200}
                height={675}
                className="aspect-video w-full object-cover"
                data-ai-hint="hotel room luxurious"
                priority
              />
            </CardHeader>
            <CardContent className="p-6">
              <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">{room.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">{room.type}</Badge>
                <Badge variant="secondary" className="text-sm">Capacity: {room.capacity} guests</Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {room.description}
              </p>

              <Separator className="my-6" />

              <h2 className="text-2xl font-semibold text-foreground mb-4">Amenities</h2>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {room.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-3 text-foreground">
                    <AmenityIcon amenity={amenity} />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Book Your Stay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 text-center">
                <p className="text-3xl font-bold text-accent">
                  ${room.pricePerNight}
                  <span className="text-base font-normal text-muted-foreground"> / night</span>
                </p>
              </div>
              <RoomBookingForm room={room} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const room = await getRoomById(params.id);
  if (!room) {
    return {
      title: 'Room Not Found | SmartStay',
    };
  }
  return {
    title: `${room.name} | SmartStay`,
    description: `Details and booking for ${room.name}. ${room.description.substring(0, 160)}`,
  };
}

// Optional: Generate static paths if you have a fixed number of rooms
// export async function generateStaticParams() {
//   return mockRooms.map((room) => ({
//     id: room.id,
//   }));
// }

