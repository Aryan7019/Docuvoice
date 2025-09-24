"use client"
import React, { useState } from 'react'
import { IconCrown } from "@tabler/icons-react"
import { DoctorAgent } from './DoctorAgentsList'

type Props = {
   doctor: DoctorAgent;
   onSelectDoctor: (doctor: DoctorAgent) => void;
   isSelected: boolean;
}

export const useSelectedDoctor = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent | null>(null);

  return { selectedDoctor, setSelectedDoctor };
}

export const CompactDoctorCard = ({ doctor, onSelectDoctor, isSelected }: Props) => {
  return (
    <div 
      className={`rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer flex flex-col h-full group ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
      }`}
      onClick={() => onSelectDoctor(doctor)}
    >
      <div className="flex flex-col items-center pt-3 px-3">
        {/* Circular Doctor Image */}
        <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-colors duration-200 mb-2 ${
          isSelected ? 'border-blue-400' : 'border-gray-200 group-hover:border-blue-400'
        }`}>
          <img
            src={doctor.image}
            alt={doctor.specialist}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex justify-center items-center gap-1 mb-1 w-full">
          <h3 className={`font-semibold text-xs text-center transition-colors duration-200 ${
            isSelected 
              ? 'text-blue-700 dark:text-blue-300' 
              : 'text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300'
          }`}>
            {doctor.specialist}
          </h3>
          {doctor.subscriptionRequired && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded-full dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
              <IconCrown className="h-2.5 w-2.5" />
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col flex-1 p-3 pt-0">
        {/* Full Description */}
        <p className={`text-[10px] mb-2 flex-1 leading-relaxed transition-colors duration-200 ${
          isSelected 
            ? 'text-blue-600 dark:text-blue-300' 
            : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300'
        }`}>
          {doctor.description}
        </p>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 text-[10px] font-medium">
            ✓ Selected
          </div>
        )}
      </div>
    </div>
  )
}