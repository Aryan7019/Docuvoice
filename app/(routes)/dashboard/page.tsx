"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconMicrophone,
  IconCalendar,
  IconClock,
  IconMessage,
  IconVideo,
  IconCrown,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useUser,useClerk } from "@clerk/nextjs";
import { AIDoctorAgents } from "./components/list";
import { useRouter } from "next/navigation";

// Add this interface
interface Consultation {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  status: string;
}

const ConsultationHistory = () => {
  const consultations: Consultation[] = []; // Empty array with explicit type

  if (consultations.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900/30">
            <IconCalendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          No Recent Consultations
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You haven't had any consultations yet. Start your first conversation with one of our AI doctors!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <IconCalendar className="h-5 w-5 text-blue-600" />
        Consultation History
      </h2>
      <div className="space-y-4">
        {consultations.map((consultation) => (
          <div
            key={consultation.id}
            className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-750"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {consultation.doctor}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {consultation.specialty}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <IconClock className="h-4 w-4" />
                  {consultation.date} at {consultation.time}
                </span>
                <span>{consultation.duration}</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400">
                {consultation.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AIDoctorCard = ({ doctor }: { doctor: typeof AIDoctorAgents[0] }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow dark:bg-neutral-900 dark:border-neutral-700 dark:hover:shadow-neutral-800">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={doctor.image}
          alt={doctor.specialist}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {doctor.specialist}
            </h3>
            {doctor.subscriptionRequired && (
              <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                <IconCrown className="h-3 w-3" />
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {doctor.description}
          </p>
        </div>
      </div>
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
        <IconMicrophone className="h-4 w-4" />
        Start Consultation
      </button>
    </div>
  );
};

const AIDoctorsGrid = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        AI Doctor Specialists
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AIDoctorAgents.map((doctor) => (
          <AIDoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

const StartConsultationButton = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-lg">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
          <IconMicrophone className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Start Instant Consultation
        </h2>
        <p className="text-blue-100 mb-6">
          Connect with a doctor in minutes. 24/7 availability.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 mx-auto">
          <IconVideo className="h-5 w-5" />
          Start Voice Consultation
        </button>
      </div>
    </div>
  );
};

const WelcomeBanner = () => {
  const { user } = useUser();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-blue-100">
            How are you feeling today? Our AI doctors are ready to help.
          </p>
        </div>
        <div className="hidden md:flex">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <IconMicrophone className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
            <IconMessage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Consultations</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
            <IconClock className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0h 0m</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Workspace = () => {
  return (
    <div className="flex flex-1 flex-col p-6 gap-6 overflow-y-auto">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Start Consultation Button */}
      <StartConsultationButton />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Consultation History - Now full width */}
        <ConsultationHistory />

        {/* All AI Doctors */}
        <AIDoctorsGrid />
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <img
        src="/logo.svg"
        alt="Logo"
        className="h-8 w-8 rounded-lg"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre"
      >
        Docuvoice
      </motion.span>
    </a>
  );
};

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const handleLogout = () => {
    window.location.href = "/sign-out";
  };
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Pricing",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className={cn(
      "flex w-full flex-1 flex-col bg-gray-100 md:flex-row dark:bg-neutral-900",
      "h-screen"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            {user ? (
              <SidebarLink
                link={{
                  label: user.fullName || "User",
                  href: "#",
                  icon: (
                    <img
                      src={user.imageUrl}
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={28}
                      height={28}
                      alt="User avatar"
                    />
                  ),
                }}
              />
            ) : (
              <div className="flex items-center gap-2 p-2">
                <div className="h-7 w-7 shrink-0 rounded-full bg-gray-300 animate-pulse dark:bg-gray-600"></div>
                <div className="h-4 w-20 bg-gray-300 rounded animate-pulse dark:bg-gray-600"></div>
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <Workspace />
    </div>
  );
}