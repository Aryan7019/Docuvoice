// app/(routes)/dashboard/components/report-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  IconCalendar,
  IconUser,
  IconFileReport,
  IconAlertTriangle,
  IconPill,
  IconHeartbeat,
  IconChecklist,
  IconNotes
} from "@tabler/icons-react";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

// Define the props this component now expects
interface ReportDialogProps {
  report: any | null; // The already-parsed report object
  doctorInfo: {
    doctor: string;
    specialty: string;
  } | null;
  consultationDetails: {
    createdOn: string;
    consultationDuration?: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

// Modular components for better organization
const ReportHeader = ({ doctorInfo, consultationDetails, report }: { 
  doctorInfo: any, 
  consultationDetails: any, 
  report: any 
}) => (
  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500 rounded-lg shadow-sm flex-shrink-0">
          <IconUser className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Doctor</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {report?.agent || doctorInfo.doctor}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {doctorInfo.specialty}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500 rounded-lg shadow-sm flex-shrink-0">
          <IconCalendar className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Date</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {moment(consultationDetails.createdOn).format("MMM D, YYYY")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {moment(consultationDetails.createdOn).format("h:mm A")}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const InfoCard = ({ 
  icon: Icon, 
  title, 
  children, 
  iconColor = "blue" 
}: { 
  icon: any, 
  title: string, 
  children: React.ReactNode, 
  iconColor?: string 
}) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white",
    orange: "bg-orange-500 text-white", 
    red: "bg-red-500 text-white",
    green: "bg-green-500 text-white",
    yellow: "bg-yellow-500 text-white",
    indigo: "bg-indigo-500 text-white",
    teal: "bg-teal-500 text-white"
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 pb-3">
        <h3 className="flex items-start gap-3 text-lg font-semibold text-gray-900 dark:text-white">
          <div className={`p-2 rounded-lg flex-shrink-0 ${colorClasses[iconColor as keyof typeof colorClasses]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="min-w-0 flex-1">{title}</span>
        </h3>
      </div>
      <div className="px-4 pb-4">
        {children}
      </div>
    </div>
  );
};

export function ReportDialog({
  report,
  doctorInfo,
  consultationDetails,
  isOpen,
  onClose,
}: ReportDialogProps) {
  // If we don't have the core data, don't render
  if (!isOpen || !consultationDetails || !doctorInfo) return null;

  const hasReportData = report && Object.keys(report).length > 0;

  // Severity badge color with blue theme
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

  // Helper function to safely render arrays
  const renderArrayItems = (items: string[] | undefined, fallbackText: string) => {
    if (!items || items.length === 0) {
      return <p className="text-gray-500 dark:text-gray-400 italic text-sm">{fallbackText}</p>;
    }
    return (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <IconFileReport className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Medical Report</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                Consultation with {doctorInfo.doctor}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Consultation Overview */}
          <ReportHeader 
            doctorInfo={doctorInfo}
            consultationDetails={consultationDetails}
            report={report}
          />

          {/* Patient Information */}
          {report?.user && report.user !== "Anonymous" && (
            <InfoCard icon={IconUser} title="Patient Information" iconColor="blue">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Patient Name:</span> {report.user}
              </p>
            </InfoCard>
          )}

          {/* Chief Complaint */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 pb-3">
              <h3 className="flex items-start justify-between gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg flex-shrink-0 bg-orange-500 text-white">
                    <IconAlertTriangle className="h-5 w-5" />
                  </div>
                  <span className="min-w-0 flex-1">Chief Complaint</span>
                </div>
                {report?.severity && (
                  <Badge className={`text-sm font-medium ${getSeverityColor(report.severity)}`}>
                    {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                  </Badge>
                )}
              </h3>
            </div>
            <div className="px-4 pb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {report?.chiefComplaint || "No chief complaint recorded"}
              </p>
            </div>
          </div>

          {/* Symptoms */}
          {hasReportData && report.symptoms && report.symptoms.length > 0 && (
            <InfoCard icon={IconHeartbeat} title="Symptoms" iconColor="red">
              {renderArrayItems(report.symptoms, "No symptoms recorded")}
            </InfoCard>
          )}

          {/* Summary */}
          {report?.summary && (
            <InfoCard icon={IconNotes} title="Consultation Summary" iconColor="green">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {report.summary}
              </p>
            </InfoCard>
          )}

          {/* Medications */}
          {hasReportData && report.medicationsMentioned && report.medicationsMentioned.length > 0 && (
            <InfoCard icon={IconPill} title="Medications Mentioned" iconColor="indigo">
              <div className="flex flex-wrap gap-2">
                {report.medicationsMentioned.map((medication: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  >
                    {medication}
                  </Badge>
                ))}
              </div>
            </InfoCard>
          )}

          {/* Recommendations */}
          {hasReportData && report.recommendations && report.recommendations.length > 0 && (
            <InfoCard icon={IconChecklist} title="Medical Recommendations" iconColor="teal">
              {renderArrayItems(report.recommendations, "No specific recommendations provided")}
            </InfoCard>
          )}

          {/* No Report Data Fallback */}
          {!hasReportData && (
            <InfoCard icon={IconFileReport} title="Medical Assessment" iconColor="blue">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Consultation Details</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  This consultation was completed successfully. Detailed report analysis is not available.
                </p>
              </div>
            </InfoCard>
          )}

          {/* Medical Disclaimer */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
              <IconAlertTriangle className="h-4 w-4" />
              Important Medical Disclaimer
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This AI-powered consultation is for informational purposes only and should not replace professional medical advice.
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <p>Report generated on {moment(report?.timestamp || consultationDetails.createdOn).format("MMMM D, YYYY [at] h:mm A")}</p>
            <p className="mt-1">DocuVoice AI Medical Assistant • Confidential Medical Document</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}