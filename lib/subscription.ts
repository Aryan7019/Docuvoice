import { auth } from '@clerk/nextjs/server';

/**
 * Check if the current user has an ACTIVE Pro subscription
 * @returns Promise<boolean> - true if user has active 'pro' subscription
 */
export async function isProUser(): Promise<boolean> {
  const { has, sessionClaims } = await auth();
  
  // Check if user has pro plan AND subscription is active
  // Clerk stores subscription status in public metadata
  const hasPro = has({ plan: 'pro' });
  
  // Also check if subscription is actually active (not cancelled/expired)
  const metadata = sessionClaims?.metadata as any;
  const subscriptionStatus = metadata?.subscriptionStatus;
  
  // User is pro only if they have the plan AND subscription is active
  return hasPro && (subscriptionStatus === 'active' || subscriptionStatus === undefined);
}
