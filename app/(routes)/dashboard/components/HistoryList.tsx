"use client";

import { IconCalendar, IconClock } from "@tabler/icons-react";

export interface Consultation {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  status: string;
}

interface ConsultationHistoryProps {
  consultations?: Consultation[];
}

const ConsultationHistory = ({ consultations = [] }: ConsultationHistoryProps) => {
  if (consultations.length === 0) {
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
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
        <IconCalendar className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
        Consultation History
      </h2>
      <div className="space-y-4">
        {consultations.map((consultation) => (
          <div
            key={consultation.id}
            className="p-3 md:p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-750"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                  {consultation.doctor}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {consultation.specialty}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs md:text-sm text-gray-600 dark:text-gray-400 gap-2 md:gap-0">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="flex items-center gap-1">
                  <IconClock className="h-3 w-3 md:h-4 md:w-4" />
                  {consultation.date} at {consultation.time}
                </span>
                <span>{consultation.duration}</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400 self-start md:self-auto">
                {consultation.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultationHistory;