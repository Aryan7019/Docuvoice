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
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <IconCalendar className="h-6 w-6 text-blue-600" />
            Consultation History
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
            {consultations.length} session{consultations.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Horizontal Cards - 2 per row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {consultations.map((consultation) => {
            const doctorInfo = getDoctorInfo(consultation);
            const chiefComplaint = getChiefComplaint(consultation);
            const severity = getSeverity(consultation);
            const doctorImage = getDoctorImage(consultation);

            return (
              <div 
                key={consultation.id} 
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="flex">
                  {/* Doctor Image - Left Side */}
                  <div className="relative w-40 flex-shrink-0 bg-gray-100 dark:bg-neutral-800">
                    <img 
                      src={doctorImage} 
                      alt={doctorInfo.doctor}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.error(`Failed to load doctor image: ${doctorImage}`);
                        e.currentTarget.src = '/doctor1.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                  </div>

                  {/* Content - Right Side */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                          {doctorInfo.doctor}
                        </h3>
                        <p className="text-sm text-cyan-600 dark:text-cyan-400">
                          {doctorInfo.specialty}
                        </p>
                      </div>
                      {severity && (
                        <Badge className={`text-xs font-medium ${getSeverityColor(severity)}`}>
                          {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </Badge>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        Chief Complaint
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                        {chiefComplaint}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <IconClock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{moment(consultation.createdOn).fromNow()}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 group-hover:bg-cyan-50 group-hover:text-cyan-600 group-hover:border-cyan-600 dark:group-hover:bg-cyan-900/20 dark:group-hover:text-cyan-400 transition-all"
                        onClick={() => handleShowReport(consultation)}
                      >
                        <IconFileReport className="h-3.5 w-3.5" />
                        View Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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