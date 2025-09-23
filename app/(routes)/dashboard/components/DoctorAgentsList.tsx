"use client";

import React from "react";
import { IconMicrophone, IconCrown } from "@tabler/icons-react";

export type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  subscriptionRequired: boolean;
};

const AIDoctorCard = ({ doctor }: { doctor: DoctorAgent }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow dark:bg-neutral-900 dark:border-neutral-700 dark:hover:shadow-neutral-800 flex flex-col h-full overflow-hidden">
      {/* Responsive Image Height */}
      <div className="w-full h-40 sm:h-48 md:h-56 overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.specialist}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Responsive Content */}
      <div className="flex flex-col flex-1 p-3 md:p-4">
        <div className="flex justify-between items-start mb-2 md:mb-3">
          {/* FIX: Removed line-clamp-1 to show the full name */}
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

        {/* Responsive Button */}
        <button className="w-full bg-blue-600 text-white py-2 md:py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 md:gap-2 font-medium mt-auto text-xs md:text-sm">
          <IconMicrophone className="h-3 w-3 md:h-4 md:w-4" />
          Start Consultation
        </button>
      </div>
    </div>
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
      {/* Responsive Grid and Gaps */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {doctors.map((doctor) => (
          <AIDoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorAgentsList;