// app/(routes)/dashboard/components/ConsultationHistory.tsx
"use client";

import { IconCalendar, IconClock, IconFileReport } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useState } from "react";
import { ReportDialog } from "./report-dialog";

// Interface matching your database schema
export interface Consultation {
  id: string;
  sessionId: string;
  createdBy: string;
  notes?: string;
  selectedDoctor: any;
  report?: any;
  conversation?: any[];
  createdOn: string;
  consultationDuration?: number;
  callStartedAt?: string;
  callEndedAt?: string;
}

interface ConsultationHistoryProps {
  consultations?: Consultation[];
  isLoading?: boolean;
}

// Loading Skeleton
const LoadingSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty State
const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900/30">
          <IconCalendar className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        No Recent Consultations
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-4">
        You haven't had any consultations yet. Start your first conversation with one of our AI doctors!
      </p>
    </div>
  );
};

const ConsultationHistory = ({ consultations = [], isLoading = false }: ConsultationHistoryProps) => {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Helper function to parse doctor info
  // MODIFIED: Handle null input
  const getDoctorInfo = (consultation: Consultation | null) => {
    if (!consultation) {
      return { doctor: "AI Doctor", specialty: "General Medicine" };
    }
    try {
      const selectedDoctor = typeof consultation.selectedDoctor === 'string'
        ? JSON.parse(consultation.selectedDoctor)
        : consultation.selectedDoctor;

      return {
        doctor: selectedDoctor?.specialist || selectedDoctor?.name || "AI Doctor",
        specialty: selectedDoctor?.specialty || "General Medicine"
      };
    } catch (error) {
      return {
        doctor: "AI Doctor",
        specialty: "General Medicine"
      };
    }
  };

  // Helper function to parse report data
  // MODIFIED: Handle null input
  const getReportData = (consultation: Consultation | null) => {
    if (!consultation || !consultation.report) {
      return null;
    }
    try {
      return typeof consultation.report === 'string'
        ? JSON.parse(consultation.report)
        : consultation.report;
    } catch (error)
    {
      console.error("Failed to parse report in getReportData:", error);
      return null;
    }
  };

  // Helper function to get chief complaint
  const getChiefComplaint = (consultation: Consultation) => {
    const report = getReportData(consultation);
    return report?.chiefComplaint || "Medical Consultation";
  };

  const handleShowReport = (consultation: Consultation) => {
    console.log("Showing report for consultation:", consultation);
    setSelectedConsultation(consultation);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedConsultation(null);
  };

  // --- NEW LOGIC ---
  // Prepare props for the dialog based on the selected consultation
  const selectedReport = getReportData(selectedConsultation);
  const selectedDoctorInfo = getDoctorInfo(selectedConsultation);
  const selectedConsultationDetails = selectedConsultation
    ? {
      createdOn: selectedConsultation.createdOn,
      consultationDuration: selectedConsultation.consultationDuration,
    }
    : null;
  // --- END NEW LOGIC ---


  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
          <IconCalendar className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          Recent Consultations
        </h2>
        <LoadingSkeleton />
      </div>
    );
  }

  if (consultations.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <IconCalendar className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            Consultation History
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {consultations.length} session{consultations.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table with reduced height - shows 3-4 rows at a time */}
        <div className="rounded-md border">
          <div className="max-h-[280px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white dark:bg-neutral-900 z-10 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Doctor</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Chief Complaint</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Time</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Report</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((consultation) => {
                  const doctorInfo = getDoctorInfo(consultation);
                  const chiefComplaint = getChiefComplaint(consultation);

                  return (
                    <tr key={consultation.id} className="border-b hover:bg-gray-50/50 dark:hover:bg-neutral-800/50">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{doctorInfo.doctor}</span>
                          <span className="text-xs text-gray-500">{doctorInfo.specialty}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-[200px]">
                          <span className="text-sm line-clamp-2">{chiefComplaint}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm">
                          <IconClock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {moment(consultation.createdOn).fromNow()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => handleShowReport(consultation)}
                          >
                            <IconFileReport className="h-4 w-4" />
                            Show
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Dialog - MODIFIED */}
      <ReportDialog
        report={selectedReport}
        doctorInfo={selectedDoctorInfo}
        consultationDetails={selectedConsultationDetails}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default ConsultationHistory;