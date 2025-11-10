"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IconMicrophone, IconCrown, IconSparkles, IconLock } from "@tabler/icons-react";
import { hasFakeSubscription } from "@/lib/subscription-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  subscriptionRequired: boolean;
  voiceId: string;
  agentPrompt: string;
};

export const AIDoctorCard = ({ doctor }: { doctor: DoctorAgent }) => {
  const router = useRouter();
  const hasFakeSubscriptionEnabled = hasFakeSubscription();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartConsultation = async () => {
    setLoading(true);
    try {
      // Create session in database via API
      const response = await fetch('/api/session-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: '', // Empty notes for direct doctor selection
          selectedDoctor: doctor
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      
      if (data.sessionId) {
        // Redirect to consultation page with the created session ID
        router.push(`/dashboard/medical-agent/${data.sessionId}`);
      } else {
        console.error('No sessionId in response');
        alert('Failed to start consultation. Please try again.');
      }
    } catch (error) {
      console.error('Error starting consultation:', error);
      alert('Failed to start consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    setShowUpgradeDialog(false);
    router.push('/pricing');
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow dark:bg-neutral-900 dark:border-neutral-700 dark:hover:shadow-neutral-800 flex flex-col h-full overflow-hidden">
        <div className="w-full h-40 sm:h-48 md:h-56 overflow-hidden">
          <img
            src={doctor.image}
            alt={doctor.specialist}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="flex flex-col flex-1 p-3 md:p-4">
          <div className="flex justify-between items-start mb-2 md:mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base lg:text-lg">
              {doctor.specialist}
            </h3>
            {doctor.subscriptionRequired && (
              <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
                <IconCrown className="h-3 w-3" />
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 flex-1 line-clamp-3">
            {doctor.description}
          </p>
          
          {/* Show different button based on subscription status */}
          {doctor.subscriptionRequired && !hasFakeSubscriptionEnabled ? (
            <button 
              onClick={() => setShowUpgradeDialog(true)}
              className="w-full bg-gray-400 text-white py-2 md:py-2.5 rounded-lg cursor-pointer hover:bg-gray-500 transition-colors flex items-center justify-center gap-1 md:gap-2 font-medium mt-auto text-xs md:text-sm"
            >
              <IconLock className="h-3 w-3 md:h-4 md:w-4" />
              Upgrade to Access
            </button>
          ) : (
            <button 
              onClick={handleStartConsultation}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 md:py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 md:gap-2 font-medium mt-auto text-xs md:text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3 w-3 md:h-4 md:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </>
              ) : (
                <>
                  <IconMicrophone className="h-3 w-3 md:h-4 md:w-4" />
                  Start Consultation
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg">
                <IconCrown className="h-5 w-5 text-white" />
              </div>
              Premium Specialist
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              You're currently on the <span className="font-semibold text-gray-900 dark:text-white">Free Plan</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Doctor Info */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-300 dark:border-blue-700 flex-shrink-0">
                <img
                  src={doctor.image}
                  alt={doctor.specialist}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {doctor.specialist}
                  <IconCrown className="h-4 w-4 text-amber-500" />
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {doctor.description}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                Access to <span className="font-semibold">{doctor.specialist}</span> requires a premium subscription.
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h5 className="font-semibold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-2">
                  <IconSparkles className="h-4 w-4" />
                  Upgrade to Premium
                </h5>
                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">✓</span>
                    <span>Access to all 9 premium specialists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">✓</span>
                    <span>Unlimited voice consultations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">✓</span>
                    <span>Detailed medical reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">✓</span>
                    <span>24/7 availability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
              className="flex-1"
            >
              Stay on Free Plan
            </Button>
            <Button
              onClick={handleUpgrade}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            >
              <IconSparkles className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface DoctorAgentsListProps {
  doctors: DoctorAgent[];
}

const DoctorAgentsList = ({ doctors = [] }: DoctorAgentsListProps) => {
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-6">
        AI Doctor Specialists
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {doctors.map((doctor) => (
          <AIDoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorAgentsList;