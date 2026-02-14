// app/(routes)/dashboard/components/ConsultationHistory.tsx
"use client";

import { IconCalendar, IconClock, IconFileReport } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <div className="w-14 h-14 md:w-16 md:h-16 bg-cyan-100 rounded-full flex items-center justify-center dark:bg-cyan-900/30">
          <IconCalendar className="h-6 w-6 md:h-8 md:w-8 text-cyan-600 dark:text-cyan-400" />
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      const parsed = typeof consultation.report === 'string'
        ? JSON.parse(consultation.report)
        : consultation.report;
      return parsed;
    } catch (error)
    {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to parse report in getReportData:", error, "Raw report:", consultation.report);
      }
      return null;
    }
  };

  // Helper function to get chief complaint
  const getChiefComplaint = (consultation: Consultation) => {
    const report = getReportData(consultation);
    return report?.chiefComplaint || "Medical Consultation";
  };

  // Helper function to get severity
  const getSeverity = (consultation: Consultation) => {
    const report = getReportData(consultation);
    return report?.severity || null;
  };

  // Severity badge color
  const getSeverityColor = (severity: string) => {
    if (!severity) return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
    
    switch (severity.toLowerCase()) {
      case 'mild':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    }
  };

  const handleShowReport = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedConsultation(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(consultations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConsultations = consultations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <IconCalendar className="h-4 w-4 md:h-5 md:w-5 text-cyan-600" />
          Recent Consultations
        </h2>
        <LoadingSkeleton />
      </div>
    );
  }

  if (consultations.length === 0) {
    return <EmptyState />;
  }

  // Helper to get doctor image
  const getDoctorImage = (consultation: Consultation) => {
    try {
      const selectedDoctor = typeof consultation.selectedDoctor === 'string'
        ? JSON.parse(consultation.selectedDoctor)
        : consultation.selectedDoctor;
      return selectedDoctor?.image || '/doctor1.png';
    } catch (error) {
      console.error('Error parsing doctor image:', error);
      return '/doctor1.png';
    }
  };

  return (
    <>
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <IconCalendar className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />
            Consultation History
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 px-2 sm:px-3 py-1 rounded-full">
            {consultations.length} session{consultations.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Horizontal Cards - 2 per row on desktop, 1 per row on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
          {currentConsultations.map((consultation) => {
            const doctorInfo = getDoctorInfo(consultation);
            const chiefComplaint = getChiefComplaint(consultation);
            const severity = getSeverity(consultation);
            const doctorImage = getDoctorImage(consultation);

            return (
              <div 
                key={consultation.id} 
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all group w-full"
              >
                <div className="flex flex-row w-full h-full">
                  {/* Doctor Image - Full height */}
                  <div className="relative w-32 sm:w-48 md:w-56 flex-shrink-0 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
                    <img 
                      src={doctorImage} 
                      alt={doctorInfo.doctor}
                      className="w-full h-full object-cover absolute inset-0"
                      loading="lazy"
                      onError={(e) => {
                        console.error(`Failed to load doctor image: ${doctorImage}`);
                        e.currentTarget.src = '/doctor1.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-4 sm:p-5 md:p-6 min-w-0 flex flex-col">
                    {/* Header with Doctor Info and Badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-1 truncate">
                          {doctorInfo.doctor}
                        </h3>
                        <p className="text-xs sm:text-sm text-cyan-600 dark:text-cyan-400 font-medium truncate">
                          {doctorInfo.specialty}
                        </p>
                      </div>
                      {severity && (
                        <Badge className={`text-xs font-semibold flex-shrink-0 px-2 py-0.5 ${getSeverityColor(severity)}`}>
                          {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </Badge>
                      )}
                    </div>

                    {/* Chief Complaint */}
                    <div className="flex-1 mb-3">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                        Chief Complaint
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {chiefComplaint}
                      </p>
                    </div>

                    {/* Footer with Time and Button */}
                    <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-gray-100 dark:border-neutral-800">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 min-w-0">
                        <IconClock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{moment(consultation.createdOn).fromNow()}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 px-3 py-1.5 h-auto text-xs font-medium border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white dark:border-cyan-500 dark:text-cyan-400 dark:hover:bg-cyan-600 dark:hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                        onClick={() => handleShowReport(consultation)}
                      >
                        <IconFileReport className="h-3.5 w-3.5 mr-1" />
                        <span className="sm:hidden">View</span>
                        <span className="hidden sm:inline">View Report</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
            >
              Previous
            </button>
            
            {/* Page Numbers - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 ${
                    currentPage === page
                      ? 'bg-cyan-600 text-white'
                      : 'border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Page Indicator - Visible only on mobile */}
            <div className="sm:hidden px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
            >
              Next
            </button>
          </div>
        )}
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