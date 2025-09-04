// app/sign-out/page.tsx
"use client";

import { useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      if (isSignedIn) {
        await signOut();
      }
      window.location.href = "/";
    };

    performSignOut();
  }, [signOut, isSignedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Signing out...</h1>
        <p>Please wait while we sign you out.</p>
      </div>
    </div>
  );
}