
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, UserCircle, LogOut, LayoutDashboard, BedDouble, Sparkles, Settings } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: LayoutDashboard, roles: ["guest", "admin"] },
  { href: "/rooms", label: "Rooms", icon: BedDouble, roles: ["guest", "admin"] },
  { href: "/my-bookings", label: "My Bookings", icon: BedDouble, roles: ["guest"] },
  { href: "/recommendations", label: "Recommendations", icon: Sparkles, roles: ["guest"] },
  { href: "/admin/dashboard", label: "Admin Dashboard", icon: Settings, roles: ["admin"] },
];

export function SiteHeader() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  const getInitials = (name?: string) => {
    if (!name) return "SS";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };
  
  const filteredNavLinks = navLinks.filter(link => user ? link.roles.includes(user.role) : link.roles.includes('guest'));


  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card">
          <nav className="grid gap-2 text-lg font-medium">
            <Logo className="mb-4" />
            {filteredNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === link.href && "text-primary bg-muted"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex items-center gap-2">
         <Logo />
      </div>
      
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-6">
         {filteredNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground px-2 py-1",
                pathname === link.href ? "text-foreground font-semibold border-b-2 border-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
      </nav>

      <div className="ml-auto flex items-center gap-4">
        {!loading && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt={user.name || user.email} data-ai-hint="user avatar" />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name || user.email} ({user.role})</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">My Profile</Link>
              </DropdownMenuItem>
              {user.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : !loading ? (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="default">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        ) : (
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" /> // Skeleton for loading state
        )}
      </div>
    </header>
  );
}
