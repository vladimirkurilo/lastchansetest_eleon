
"use client";

import { useState } from 'react';
import type { PersonalizedRecommendationsInput } from '@/ai/flows/personalized-recommendations';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

interface RecommendationFormProps {
  onSubmit: (data: PersonalizedRecommendationsInput) => void;
  isLoading: boolean;
}

export function RecommendationForm({ onSubmit, isLoading }: RecommendationFormProps) {
  const [guestProfile, setGuestProfile] = useState('');
  const [bookingHistory, setBookingHistory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ guestProfile, bookingHistory });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Personalized Recommendations</CardTitle>
        </div>
        <CardDescription>
          Tell us about your preferences and past stays to get tailored suggestions for our hotel services.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="guestProfile" className="text-base">Your Profile & Preferences</Label>
            <Textarea
              id="guestProfile"
              value={guestProfile}
              onChange={(e) => setGuestProfile(e.target.value)}
              placeholder="e.g., I enjoy quiet evenings, fine dining, and usually travel for business. I prefer a firm mattress and a room with a view."
              className="min-h-[120px] text-base"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookingHistory" className="text-base">Your Booking History (Optional)</Label>
            <Textarea
              id="bookingHistory"
              value={bookingHistory}
              onChange={(e) => setBookingHistory(e.target.value)}
              placeholder="e.g., Last time I stayed in a suite and used the spa. Previously, I booked a standard room and frequently visited the gym."
              className="min-h-[120px] text-base"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" disabled={isLoading}>
            {isLoading ? 'Getting Recommendations...' : 'Get My Recommendations'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
