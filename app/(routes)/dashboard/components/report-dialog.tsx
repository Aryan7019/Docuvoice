// app/(routes)/dashboard/components/report-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconFileReport,
  IconAlertTriangle,
  IconPill,
  IconHeartbeat,
  IconChecklist,
  IconStar,
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
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
    }
  };

  // Helper function to safely render arrays
  const renderArrayItems = (items: string[] | undefined, fallbackText: string) => {
    if (!items || items.length === 0) {
      return <p className="text-gray-500 dark:text-gray-400 italic">{fallbackText}</p>;
    }
    return (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="w-2 h-2 bg-current rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <IconFileReport className="h-5 w-5 text-blue-600" />
            Medical Consultation Report
          </DialogTitle>
          <DialogDescription>
            Detailed report for your consultation with {doctorInfo.doctor}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Consultation Report</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">DocuVoice AI Medical Assistant</p>
          </div>

          {/* Consultation Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <IconUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Doctor</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {report?.agent || doctorInfo.doctor}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {doctorInfo.specialty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <IconCalendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Consultation Date</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {moment(consultationDetails.createdOn).format("MMMM D, YYYY")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {moment(consultationDetails.createdOn).format("h:mm A")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <IconClock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {report?.duration || consultationDetails.consultationDuration
                    ? report?.duration || `${Math.round(consultationDetails.consultationDuration! / 60)} minutes`
                    : 'Not recorded'
                  }
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Session length
                </p>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          {report?.user && report.user !== "Anonymous" && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-blue-500 pl-3 flex items-center gap-2">
                <IconUser className="h-5 w-5 text-blue-500" />
                Patient Information
              </h3>
              <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Patient Name:</span> {report.user}
                </p>
              </div>
            </div>
          )}

          {/* Chief Complaint */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-orange-500 pl-3 flex items-center gap-2">
              <IconAlertTriangle className="h-5 w-5 text-orange-500" />
              Chief Complaint
            </h3>
            <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                {report?.chiefComplaint || "No chief complaint recorded"}
              </p>
            </div>
          </div>

          {/* Symptoms & Severity */}
          {hasReportData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Symptoms */}
              {report.symptoms && report.symptoms.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-red-500 pl-3 flex items-center gap-2">
                    <IconHeartbeat className="h-5 w-5 text-red-500" />
                    Symptoms
                  </h3>
                  <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                    {renderArrayItems(report.symptoms, "No symptoms recorded")}
                  </div>
                </div>
              )}

              {/* Severity & Duration */}
              <div className="space-y-4">
                {/* Severity */}
                {report.severity && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                      <IconStar className="h-5 w-5 text-yellow-500" />
                      Condition Severity
                    </h3>
                    <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                      <Badge className={`text-sm font-medium ${getSeverityColor(report.severity)}`}>
                        {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Duration */}
                {report.duration && report.duration !== "Not specified" && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-purple-500 pl-3 flex items-center gap-2">
                      <IconClock className="h-5 w-5 text-purple-500" />
                      Symptom Duration
                    </h3>
                    <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300">{report.duration}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {report?.summary && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-green-500 pl-3 flex items-center gap-2">
                <IconNotes className="h-5 w-5 text-green-500" />
                Consultation Summary
              </h3>
              <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {report.summary}
                </p>
              </div>
            </div>
          )}

          {/* Medications */}
          {hasReportData && report.medicationsMentioned && report.medicationsMentioned.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                <IconPill className="h-5 w-5 text-indigo-500" />
                Medications Mentioned
              </h3>
              <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {report.medicationsMentioned.map((medication: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800"
                    >
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {hasReportData && report.recommendations && report.recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-teal-500 pl-3 flex items-center gap-2">
                <IconChecklist className="h-5 w-5 text-teal-500" />
                Medical Recommendations
              </h3>
              <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                {renderArrayItems(report.recommendations, "No specific recommendations provided")}
              </div>
            </div>
          )}

          {/* No Report Data Fallback */}
          {!hasReportData && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-gray-500 pl-3">
                Medical Assessment
              </h3>
              <div className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Consultation Details</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      This consultation was completed successfully. Detailed report analysis is not available.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical Disclaimer */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2">
              <IconAlertTriangle className="h-4 w-4" />
              Important Medical Disclaimer
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
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