"use client";

import { motion } from "motion/react";
import { useUser, UserButton, useAuth } from '@clerk/nextjs';
import Link from "next/link";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const { user } = useUser();
  const { isLoaded } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isLoaded || !isClient) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between border-b border-neutral-200/50 bg-white/30 backdrop-blur-xl px-5 py-5 dark:border-neutral-800/50 dark:bg-black/30">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-10 w-10 rounded-lg" />
          <h1 className="text-base font-bold md:text-2xl">Docuvoice</h1>
        </div>
        
        <div className="h-10 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </nav>
    );
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between border-b border-neutral-200/50 bg-white/30 backdrop-blur-xl px-5 py-5 dark:border-neutral-800/50 dark:bg-black/30">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-10 w-10 rounded-lg" />
        <h1 className="text-base font-bold md:text-2xl">Docuvoice</h1>
      </div>
      
      {!user ? (
        <Link href="/sign-in">
          <button className="w-20 transform rounded-lg bg-black/80 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black md:w-25 dark:bg-white/80 dark:text-black dark:hover:bg-white">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex items-center gap-7">
         <div className="hidden md:block">{user.fullName}</div>
          <UserButton />
          <Link href="/dashboard">
          <button className="transform rounded-lg bg-black/80 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black dark:bg-white/80 dark:text-black dark:hover:bg-white" >
            Dashboard
          </button>
          </Link>
        </div>
      )}
    </nav>
  );
};