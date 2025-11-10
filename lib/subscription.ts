// lib/subscription.ts
import { currentUser } from "@clerk/nextjs/server";

/**
 * Check if the user has an active subscription
 * This function checks Clerk's publicMetadata for subscription status
 * Works with Clerk's PricingTable component
 * If NEXT_PUBLIC_ENABLE_FAKE_SUBSCRIPTION is true, it will always return true
 */
export async function hasActiveSubscription(): Promise<boolean> {
  // Check if fake subscription is enabled
  const enableFakeSubscription = process.env.NEXT_PUBLIC_ENABLE_FAKE_SUBSCRIPTION === 'true';
  
  if (enableFakeSubscription) {
    console.log("🎭 Fake subscription enabled - bypassing subscription check");
    return true;
  }

  try {
    const user = await currentUser();
    
    if (!user) {
      return false;
    }

    // Check if user has subscription in publicMetadata
    // Clerk's PricingTable sets these values automatically
    const metadata = user.publicMetadata as { 
      subscription?: string; 
      subscriptionStatus?: string;
      stripeSubscriptionId?: string;
    };
    
    // Check for active subscription from Clerk's PricingTable
    const hasSubscription = 
      metadata?.subscription === 'premium' || 
      metadata?.subscriptionStatus === 'active' ||
      !!metadata?.stripeSubscriptionId; // Clerk sets this when user subscribes

    console.log("Subscription check:", { 
      hasSubscription, 
      metadata: metadata 
    });

    return hasSubscription;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

// Note: For client-side subscription checks, use lib/subscription-client.ts
// This file contains server-only functions