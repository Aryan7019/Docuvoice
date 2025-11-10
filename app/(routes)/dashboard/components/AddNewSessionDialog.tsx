"use client"
import axios from 'axios'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IconMicrophone, IconVideo, IconPlus, IconCaretRightFilled, IconCrown, IconSparkles } from "@tabler/icons-react"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DoctorAgent } from './DoctorAgentsList'
import { Loader2 } from 'lucide-react'
import { CompactDoctorCard, useSelectedDoctor } from './selectedDoctorCard'
import { useRouter } from 'next/navigation'
import { hasFakeSubscription } from '@/lib/subscription-client'

function AddNewSessionDialog() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgent[]>();
  const { selectedDoctor, setSelectedDoctor } = useSelectedDoctor();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const router = useRouter();
  const hasFakeSubscriptionEnabled = hasFakeSubscription();

  const onClickNext = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/suggest-doctors', { notes: note });
      console.log("Suggested Doctors:", result.data);
      setSuggestedDoctors(result.data);
    } catch (error) {
      console.error("Failed to fetch suggested doctors:", error);
    } finally {
      setLoading(false);
    }
  }

  const resetDialog = () => {
    setNote('');
    setLoading(false);
    setSuggestedDoctors(undefined);
    setSelectedDoctor(null);
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetDialog();
    }
  };

  const handleSelectDoctor = (doctor: DoctorAgent) => {
    setSelectedDoctor(doctor);
  };

  const handleStartConsultation = async () => {
  if (!selectedDoctor) {
    console.error("No doctor selected.");
    return;
  }

  // Check if subscription is required and user doesn't have fake subscription
  if (selectedDoctor.subscriptionRequired && !hasFakeSubscriptionEnabled) {
    // Show upgrade dialog
    setShowUpgradeDialog(true);
    return;
  }

  setLoading(true);
  try {
    console.log("Sending request to create session...");
    console.log("Notes:", note);
    console.log("Selected Doctor:", selectedDoctor);

    const result = await axios.post('/api/session-chat', {
      notes: note || "", // Ensure notes is not undefined
      selectedDoctor: selectedDoctor
    });

    console.log("Full API response:", result);
    console.log("Response data:", result.data);

    if (result.data?.sessionId) {
      console.log("Session ID received:", result.data.sessionId);
      
      // Close dialog first
      setOpen(false);
      resetDialog();
      
      // Use both router and fallback
      const sessionUrl = `/dashboard/medical-agent/${result.data.sessionId}`;
      console.log("Redirecting to:", sessionUrl);
      
      router.push(sessionUrl);
      
      // Fallback: if router doesn't work within 1 second
      setTimeout(() => {
        if (window.location.pathname !== sessionUrl) {
          window.location.href = sessionUrl;
        }
      }, 1000);
      
    } else {
      console.error("No sessionId in response:", result.data);
      alert("Failed to create session. Please try again.");
    }
    
  } catch (error: any) {
    console.error("Failed to create session:", error);
    
    // Detailed error logging
    if (error.response) {
      console.error("Response error data:", error.response.data);
      console.error("Response error status:", error.response.status);
      alert(`Error: ${error.response.data?.error || "Failed to create session"}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("Network error. Please check your connection.");
    } else {
      console.error("Error message:", error.message);
      alert("An unexpected error occurred.");
    }
  } finally {
    setLoading(false);
  }
};

  const handleCancelClick = () => {
    setOpen(false);
    resetDialog();
  };

  const handleBackClick = () => {
    setSuggestedDoctors(undefined);
    setSelectedDoctor(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 md:p-10 shadow-lg cursor-pointer w-full hover:shadow-xl transition-shadow">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
              <IconPlus className="h-10 w-10 text-white" />
            </div>
            
            {/* Content */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Get AI Doctor Recommendation
            </h2>
            <p className="text-blue-50 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Describe your symptoms and we'll recommend the best specialist for your condition
            </p>
            
            {/* Big Button */}
            <button className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 hover:bg-blue-50 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
              <IconMicrophone className="h-6 w-6" />
              <span>Start Consultation</span>
              <IconCaretRightFilled className="h-5 w-5" />
            </button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <IconPlus className="h-5 w-5 text-blue-600" />
            Start New Consultation
          </DialogTitle>

          {!suggestedDoctors ? (
            <DialogDescription className="text-sm">
              Add your symptoms or any details to help the AI doctor understand your condition better.
            </DialogDescription>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">
                Based on your notes, we suggest:
              </h4>
              {selectedDoctor && (
                <p className="text-blue-600 dark:text-blue-400 mt-1">
                  Selected: {selectedDoctor.specialist}
                </p>
              )}
            </div>
          )}
        </DialogHeader>

        {!suggestedDoctors ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="symptoms" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Symptoms & Details
              </label>
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms, duration, severity..."
                className="min-h-[100px] text-sm resize-none border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                onChange={(e) => setNote(e.target.value)}
                value={note}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                The more details you provide, the better the AI can assist you.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-sm py-2"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm py-2"
                disabled={!note || note.trim().length === 0 || loading}
                onClick={onClickNext}
              >
                {loading ? (
                  <Loader2 className='animate-spin h-4 w-4' />
                ) : (
                  <>
                    Find specialists
                    <IconCaretRightFilled className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {suggestedDoctors.map((doctor, index) => (
                <CompactDoctorCard
                  key={index}
                  doctor={doctor}
                  onSelectDoctor={handleSelectDoctor}
                  isSelected={selectedDoctor?.id === doctor.id}
                />
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-sm py-2"
                onClick={handleBackClick}
              >
                Back
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm py-2"
                disabled={!selectedDoctor || loading}
                onClick={handleStartConsultation}
              >
                {loading ? (
                  <Loader2 className='animate-spin h-4 w-4' />
                ) : (
                  <>
                    <IconMicrophone className="h-4 w-4 mr-1" />
                    Start Consultation
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg">
                <IconCrown className="h-5 w-5 text-white" />
              </div>
              Premium Specialist Required
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              You're currently on the <span className="font-semibold text-gray-900 dark:text-white">Free Plan</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Selected Doctor Info */}
            {selectedDoctor && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-300 dark:border-blue-700 flex-shrink-0">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.specialist}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {selectedDoctor.specialist}
                    <IconCrown className="h-4 w-4 text-amber-500" />
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedDoctor.description}
                  </p>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                Access to <span className="font-semibold">{selectedDoctor?.specialist}</span> requires a premium subscription.
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
              onClick={() => {
                setShowUpgradeDialog(false);
                setOpen(false);
                resetDialog();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowUpgradeDialog(false);
                setOpen(false);
                resetDialog();
                router.push('/pricing');
              }}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            >
              <IconSparkles className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

export default AddNewSessionDialog;