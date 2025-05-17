
import type { PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendationDisplayProps {
  recommendations: PersonalizedRecommendationsOutput | null;
  isLoading: boolean;
  error: string | null;
}

export function RecommendationDisplay({ recommendations, isLoading, error }: RecommendationDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <CardTitle className="text-2xl">Your Recommendations</CardTitle>
          </div>
          <CardDescription>Our AI is crafting personalized suggestions for you...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8 border-destructive shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            <CardTitle className="text-2xl">Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || !recommendations.recommendations) {
    return null; // Or a message like "No recommendations to display yet."
  }

  // Simple paragraph splitting, can be improved with markdown parsing if needed
  const recommendationParagraphs = recommendations.recommendations.split('\n').filter(p => p.trim() !== '');

  return (
    <Card className="mt-8 shadow-xl bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <CheckCircle2 className="h-6 w-6" />
          <CardTitle className="text-2xl">Here Are Your Personalized Suggestions!</CardTitle>
        </div>
        <CardDescription>We think you&apos;ll love these based on your input.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendationParagraphs.map((paragraph, index) => (
          <p key={index} className="text-base text-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
