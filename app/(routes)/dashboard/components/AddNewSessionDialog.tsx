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
import { IconMicrophone, IconVideo, IconPlus, IconCaretRightFilled } from "@tabler/icons-react"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DoctorAgent } from './DoctorAgentsList'
import { Loader2 } from 'lucide-react'
import { CompactDoctorCard, useSelectedDoctor } from './selectedDoctorCard'
import { useRouter } from 'next/navigation'

function AddNewSessionDialog() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgent[]>();
  const { selectedDoctor, setSelectedDoctor } = useSelectedDoctor();
  const router = useRouter();

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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 md:p-6 shadow-lg cursor-pointer w-full hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full mb-3 md:mb-4">
              <IconMicrophone className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Start Instant Consultation
            </h2>
            <p className="text-blue-100 text-sm md:text-base mb-4 md:mb-6">
              Connect with a doctor in minutes. 24/7 availability.
            </p>
            <div className="inline-flex bg-white text-blue-600 px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors items-center justify-center gap-2 text-sm md:text-base">
              <IconVideo className="h-4 w-4 md:h-5 md:w-5" />
              Start Voice Consultation
            </div>
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
    </Dialog>
  )
}

export default AddNewSessionDialog;