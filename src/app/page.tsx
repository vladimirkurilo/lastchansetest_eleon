
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, Zap, Users, LockKeyhole } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground">
        <Image 
          src="https://placehold.co/1920x1080.png" 
          alt="Modern Hotel Lobby" 
          layout="fill" 
          objectFit="cover" 
          className="opacity-20"
          data-ai-hint="hotel lobby luxury"
        />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to SmartStay
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-lg md:text-xl">
            Experience the future of hospitality. Book rooms, unlock doors, and control your environment, all from your smartphone.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/rooms">Book Your Stay</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/login">Guest Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl text-foreground">
            Why Choose SmartStay?
          </h2>
          <p className="mx-auto mt-4 max-w-[900px] text-center text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We blend cutting-edge technology with unparalleled comfort to redefine your hotel experience.
          </p>
          <div className="mx-auto mt-12 grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            <FeatureCard
              icon={<LockKeyhole className="h-10 w-10 text-primary" />}
              title="Seamless Access"
              description="Unlock your room with your smartphone using secure BLE technology. No more physical keys!"
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Smart Room Control"
              description="Adjust lighting, temperature, and other room features directly from our app."
            />
            <FeatureCard
              icon={<BedDouble className="h-10 w-10 text-primary" />}
              title="Easy Booking"
              description="Find and book your perfect room in minutes with our intuitive interface."
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 lg:py-28 bg-secondary text-secondary-foreground">
        <div className="container mx-auto grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              For Hotel Administrators
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Manage your property efficiently with our comprehensive admin dashboard. Monitor room statuses, oversee bookings, and ensure smooth operations.
            </p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/admin/dashboard">Admin Dashboard</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://placehold.co/550x310.png"
              width={550}
              height={310}
              alt="Admin Dashboard Preview"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              data-ai-hint="dashboard interface"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-4">
          {icon}
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
