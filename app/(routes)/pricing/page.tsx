"use client";

import { PricingTable } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <IconArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get access to all premium AI doctor specialists
          </p>
        </div>

        {/* Clerk Pricing Table */}
        <div className="max-w-4xl mx-auto">
          <PricingTable />
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            What's Included in Premium
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                🩺 All Specialists
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Access to Pediatrician, Dermatologist, Psychologist, Nutritionist, Cardiologist, ENT, Orthopedic, Gynecologist, and Dentist
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                🎙️ Voice Consultations
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Real-time voice conversations with AI specialists for natural, interactive consultations
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                📋 Detailed Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Comprehensive medical reports with symptoms, diagnosis, and recommendations
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                ⏰ 24/7 Availability
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get medical advice anytime, anywhere with instant access to specialists
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
