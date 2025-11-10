import { auth } from '@clerk/nextjs/server';

/**
 * Check if the current user has the Pro plan
 * @returns Promise<boolean> - true if user has 'pro' plan
 */
export async function isProUser(): Promise<boolean> {
  const { has } = await auth();
  return has({ plan: 'pro' });
}
