// lib/subscription-client.ts
// Client-safe subscription utilities

/**
 * Client-side subscription check
 * Returns true if fake subscription is enabled
 * Use this in client components
 */
export function hasFakeSubscription(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: check process.env
    return process.env.NEXT_PUBLIC_ENABLE_FAKE_SUBSCRIPTION === 'true';
  }
  // Client-side: check process.env (available because it's NEXT_PUBLIC_)
  return process.env.NEXT_PUBLIC_ENABLE_FAKE_SUBSCRIPTION === 'true';
}

/**
 * Check if a doctor requires subscription
 * Returns true if the doctor is premium and user doesn't have fake subscription
 */
export function requiresUpgrade(subscriptionRequired: boolean): boolean {
  return subscriptionRequired && !hasFakeSubscription();
}
