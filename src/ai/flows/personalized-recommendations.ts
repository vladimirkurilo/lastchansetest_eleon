// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized recommendations for hotel services (restaurant, spa, gym) based on guest preferences and booking history.
 *
 * - personalizedRecommendations - A function that generates personalized recommendations.
 * - PersonalizedRecommendationsInput - The input type for the personalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the personalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  guestProfile: z
    .string()
    .describe('A description of the guest profile, including preferences.'),
  bookingHistory: z
    .string()
    .describe('A description of the guest booking history at the hotel.'),
});

export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of personalized recommendations for hotel services (restaurant, spa, gym), tailored to the guest profile and booking history.'
    ),
});

export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function personalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a hotel concierge AI assistant. Your task is to provide personalized recommendations for hotel services (restaurant, spa, gym) to guests based on their profile and booking history.

Guest Profile: {{{guestProfile}}}
Booking History: {{{bookingHistory}}}

Based on the guest profile and booking history, suggest hotel services that they might enjoy. Be specific in your recommendations.
`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
