
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Shield, Edit3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
    }
    if (user) {
        setName(user.name || "");
        setEmail(user.email || "");
    }
  }, [user, authLoading, router]);

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return user?.email?.[0]?.toUpperCase() || "U";
    return nameStr.split(" ").map(n => n[0]).join("").toUpperCase();
  };
  
  const handleSave = () => {
    // Here you would typically call an API to update user details
    console.log("Saving profile:", { name, email });
    // For demo, we'll just update local state if it were part of context
    // user.name = name; // This won't work as user from context is not directly mutable
    // login(email, user.role); // This would re-trigger context update
    toast({
      title: "Profile Updated",
      description: "Your profile details have been saved.",
    });
    setIsEditing(false);
  };


  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2"> <Skeleton className="h-4 w-24" /> <Skeleton className="h-10 w-full" /> </div>
            <div className="space-y-2"> <Skeleton className="h-4 w-24" /> <Skeleton className="h-10 w-full" /> </div>
            <div className="space-y-2"> <Skeleton className="h-4 w-24" /> <Skeleton className="h-10 w-full" /> </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-2xl">
      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary ring-offset-2 ring-offset-background">
            <AvatarImage src="https://placehold.co/96x96.png" alt={user.name || user.email} data-ai-hint="person portrait" />
            <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">{user.name || "User Profile"}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-base"><UserCircle className="h-5 w-5 text-primary" />Full Name</Label>
            <Input 
              id="name" 
              value={isEditing ? name : (user.name || "Not set")} 
              disabled={!isEditing} 
              onChange={(e) => setName(e.target.value)}
              className="text-base py-6"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-base"><Mail className="h-5 w-5 text-primary" />Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={isEditing ? email : user.email} 
              disabled={!isEditing} // Typically email is not editable or requires verification
              onChange={(e) => setEmail(e.target.value)}
              className="text-base py-6"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2 text-base"><Shield className="h-5 w-5 text-primary" />Role</Label>
            <Input id="role" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} disabled className="text-base py-6 bg-muted/50" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={handleSave} className="w-full sm:w-auto bg-accent hover:bg-accent/80 text-accent-foreground">Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
           <Button variant="destructive" onClick={logout} className="w-full sm:w-auto mt-4 sm:mt-0">Logout</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
