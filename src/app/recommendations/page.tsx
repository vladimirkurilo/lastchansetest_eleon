
"use client";

import { useState } from 'react';
import { personalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import type { PersonalizedRecommendationsInput, PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { RecommendationForm } from '@/components/recommendations/RecommendationForm';
import { RecommendationDisplay } from '@/components/recommendations/RecommendationDisplay';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/recommendations");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (data: PersonalizedRecommendationsInput) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await personalizedRecommendations(data);
      setRecommendations(result);
    } catch (err) {
      console.error("Error getting recommendations:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-2xl">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-8 w-full mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (!user) return null; // Will be redirected

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Discover Your Perfect Stay</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Let our AI assistant curate personalized recommendations for services and activities during your stay.
        </p>
      </div>
      
      <RecommendationForm onSubmit={handleSubmit} isLoading={isLoading} />
      
      {(recommendations || isLoading || error) && (
        <RecommendationDisplay recommendations={recommendations} isLoading={isLoading} error={error} />
      )}
    </div>
  );
}

// Metadata can be static for this page as content is dynamic client-side
// export const metadata = {
//   title: 'Personalized Recommendations | SmartStay',
//   description: 'Get AI-powered recommendations for your hotel stay.',
// };
