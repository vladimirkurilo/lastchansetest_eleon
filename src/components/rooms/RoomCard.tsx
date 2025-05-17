
import Image from "next/image";
import Link from "next/link";
import type { Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Users, Tag, ListChecks } from "lucide-react";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={room.imageUrl}
          alt={room.name}
          width={600}
          height={400}
          className="aspect-video object-cover w-full"
          data-ai-hint="hotel room interior"
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl mb-2 text-primary">{room.name}</CardTitle>
        <CardDescription className="text-base text-muted-foreground mb-4 h-20 overflow-hidden text-ellipsis">
          {room.description}
        </CardDescription>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-primary" />
            <span>{room.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Capacity: {room.capacity} guests</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <span className="font-semibold">${room.pricePerNight} / night</span>
          </div>
          {room.amenities.length > 0 && (
             <div className="flex items-start gap-2 pt-2">
                <ListChecks className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground">
                  {room.amenities.slice(0,3).join(', ')}{room.amenities.length > 3 ? '...' : ''}
                </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t">
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/rooms/${room.id}`}>View Details & Book</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
