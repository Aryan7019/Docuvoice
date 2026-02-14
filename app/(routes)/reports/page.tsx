"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";
import ConsultationHistory, { Consultation } from "../dashboard/components/ConsultationHistory";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Loading your reports..." },
  { text: "Fetching consultation history..." },
  { text: "Organizing medical records..." },
  { text: "Preparing your data..." },
];

export default function ReportsPage() {
  const { user } = useUser();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      let loaderTimeout: NodeJS.Timeout | null = null;
      
      try {
        // Don't show loader immediately - only after 300ms delay
        loaderTimeout = setTimeout(() => setIsLoading(true), 300);
        
        const response = await fetch('/api/consultations');
        
        // Clear timeout if fetch completes quickly
        if (loaderTimeout) {
          clearTimeout(loaderTimeout);
        }
        
        if (response.ok) {
          const data = await response.json();
          const transformedData: Consultation[] = (data.consultations || []).map((consult: any) => ({
            id: consult.id?.toString() || consult.sessionId,
            sessionId: consult.sessionId,
            createdBy: consult.createdBy,
            notes: consult.notes,
            selectedDoctor: consult.selectedDoctor,
            report: consult.report,
            conversation: consult.conversation,
            createdOn: consult.createdOn,
            consultationDuration: consult.consultationDuration,
            callStartedAt: consult.callStartedAt,
            callEndedAt: consult.callEndedAt,
          }));
          setConsultations(transformedData);
        }
      } catch (error) {
        console.error('Error fetching consultations:', error);
        if (loaderTimeout) {
          clearTimeout(loaderTimeout);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col">
      <Navbar />
      
      {isLoading && <MultiStepLoader loadingStates={loadingStates} loading={isLoading} duration={800} loop={true} />}
      
      <div className="pt-20 pb-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Medical Reports
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              View and manage all your consultation reports
            </p>
          </div>

          <ConsultationHistory 
            consultations={consultations} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
