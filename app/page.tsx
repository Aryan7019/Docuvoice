"use client";

import { FeatureBentoGrid } from "./_components/FeatureBentoGrid";
import { motion } from "motion/react";
import Link from "next/link";
import { Navbar } from "./_components/Navbar"; // Import from components

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <Navbar />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-40 md:py-40">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-4xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Spend Less Time on Hold, More Time on "
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
            <div className="text-blue-500 inline-block">
                  Health.
                </div>
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-md md:text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Connect with AI-powered medical specialists instantly. Get personalized health advice, symptom analysis, and treatment recommendations 24/7.
        </motion.p>
        <Link href="/sign-in">
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Get Started
          </button>
        </motion.div>
        </Link>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900">
            <div className="aspect-[16/9] h-auto w-full p-6">
              {/* Dashboard Preview Mockup */}
              <div className="h-full flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🩺</span>
                  </div>
                  <div>
                    <div className="h-3 w-32 bg-white/80 rounded"></div>
                    <div className="h-2 w-48 bg-white/60 rounded mt-1"></div>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-xl">
                    <div className="h-2 w-20 bg-gray-300 dark:bg-neutral-700 rounded mb-2"></div>
                    <div className="h-6 w-12 bg-gray-400 dark:bg-neutral-600 rounded"></div>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-xl">
                    <div className="h-2 w-16 bg-gray-300 dark:bg-neutral-700 rounded mb-2"></div>
                    <div className="h-6 w-16 bg-gray-400 dark:bg-neutral-600 rounded"></div>
                  </div>
                </div>
                
                {/* Doctor Cards Grid */}
                <div className="grid grid-cols-4 gap-2 flex-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-2">
                      <div className="w-full aspect-square bg-gray-300 dark:bg-neutral-700 rounded-lg mb-2"></div>
                      <div className="h-2 w-full bg-gray-300 dark:bg-neutral-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <FeatureBentoGrid />
    </div>
  );
}