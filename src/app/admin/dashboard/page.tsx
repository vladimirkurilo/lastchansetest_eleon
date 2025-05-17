
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockRooms } from "@/lib/mock-data";
import type { Room } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen, DoorClosed, Users, Brush, CheckCircle, MoreHorizontal, Search, ListFilter, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const statusColors: Record<string, string> = {
  Vacant: "bg-green-100 text-green-800 border-green-300",
  Occupied: "bg-blue-100 text-blue-800 border-blue-300",
  Cleaning: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

const getStatusColor = (status?: Room["status"]) => {
  return status ? statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300" : "bg-gray-100 text-gray-800 border-gray-300";
};

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push("/login?redirect=/admin/dashboard");
      } else {
        // Simulate fetching rooms for admin
        setRooms(mockRooms);
        setIsLoading(false);
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-8">Admin Dashboard</h1>
        <Card><CardContent className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent></Card>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Or a message, but redirect should handle it
  }

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.status && room.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Hotel Room Management</h1>
        <div className="flex gap-2 w-full sm:w-auto">
           <div className="relative flex-grow sm:flex-grow-0">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
                type="search" 
                placeholder="Search rooms..." 
                className="pl-8 w-full sm:w-[200px] lg:w-[300px]" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" />Filter</Button>
          <Button><PlusCircle className="mr-2 h-4 w-4" />Add Room</Button>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Room Status Overview</CardTitle>
          <CardDescription>Monitor and manage all hotel rooms in real-time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room ID</TableHead>
                <TableHead>Name & Type</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Door</TableHead>
                <TableHead>Guest ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{room.name}</div>
                    <div className="text-xs text-muted-foreground">{room.type}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`text-xs ${getStatusColor(room.status)}`}>
                      {room.status === "Cleaning" && <Brush className="mr-1.5 h-3 w-3" />}
                      {room.status === "Occupied" && <Users className="mr-1.5 h-3 w-3" />}
                      {room.status === "Vacant" && <CheckCircle className="mr-1.5 h-3 w-3" />}
                      {room.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {room.isDoorLocked ? 
                        <DoorClosed className="h-5 w-5 text-destructive mx-auto" /> : 
                        <DoorOpen className="h-5 w-5 text-green-600 mx-auto" />}
                  </TableCell>
                  <TableCell>{room.currentGuestId || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Manage Room {room.id}</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign Guest</DropdownMenuItem>
                        <DropdownMenuItem>Set for Cleaning</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                          Mark Unavailable
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredRooms.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No rooms match your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: 'Admin Dashboard | SmartStay',
  description: 'Manage hotel room inventory and statuses.',
};
