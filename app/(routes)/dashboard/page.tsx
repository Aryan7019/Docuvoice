// app/(routes)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconMicrophone,
  IconMessage,
  IconClock,
  IconCrown,
  IconCoin,
  IconDashboard,
  IconUser,
  IconCurrencyDollar,
  IconCalendar,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { AIDoctorAgents } from "./components/list";
import { useRouter, usePathname } from "next/navigation";
import AddNewSessionDialog from "./components/AddNewSessionDialog";
import ConsultationHistory, { Consultation } from "./components/ConsultationHistory";
import DoctorAgentsList from "./components/DoctorAgentsList";

// Custom SidebarLink component with active state and open/closed awareness
const CustomSidebarLink = ({
  link,
  isActive,
  isOpen,
  onClick,
}: {
  link: { label: string; href: string; icon: React.ReactNode };
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <button
        onClick={onClick}
        className={cn(
          "flex items-center font-medium transition-all duration-200 text-sm",
          "group hover:bg-blue-50 dark:hover:bg-blue-950/30",
          "rounded-full",
          isOpen
            ? "w-full justify-start gap-3 px-3 py-2.5"
            : "justify-center p-2.5",
          isActive
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400"
        )}
      >
        <div
          className={cn(
            "transition-colors duration-200 flex items-center justify-center",
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          )}
        >
          {link.icon}
        </div>
        
        {isOpen && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="truncate ml-1"
          >
            {link.label}
          </motion.span>
        )}
        
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "absolute bg-blue-500 rounded-full",
              isOpen 
                ? "right-3 top-1/2 h-2 w-2 -translate-y-1/2"
                : "top-1/2 -right-1 h-2 w-2 -translate-y-1/2"
            )}
          />
        )}
      </button>
    </motion.div>
  );
};

// Special component for user profile link to handle image display properly
const UserProfileLink = ({
  user,
  isActive,
  isOpen,
  onClick,
}: {
  user: any;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <button
        onClick={onClick}
        className={cn(
          "flex items-center font-medium transition-all duration-200 text-sm",
          "group hover:bg-blue-50 dark:hover:bg-blue-950/30",
          "rounded-full",
          isOpen
            ? "w-full justify-start gap-3 px-3 py-2.5"
            : "justify-center p-2.5",
          isActive
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400"
        )}
      >
        <div
          className={cn(
            "transition-colors duration-200 flex items-center justify-center",
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          )}
        >
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="User avatar"
              className={cn(
                "shrink-0 rounded-full object-cover",
                "h-6 w-6 lg:h-7 lg:w-7"
              )}
            />
          ) : (
            <div className={cn(
              "bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center",
              "h-6 w-6 lg:h-7 lg:w-7"
            )}>
              <IconUser className={cn(
                "text-gray-600 dark:text-gray-300",
                isOpen ? "h-4 w-4 lg:h-5 lg:w-5" : "h-3 w-3 lg:h-4 lg:w-4"
              )} />
            </div>
          )}
        </div>
        
        {isOpen && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="truncate ml-1"
          >
            {user?.fullName || "Profile"}
          </motion.span>
        )}
        
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "absolute bg-blue-500 rounded-full",
              isOpen 
                ? "right-3 top-1/2 h-2 w-2 -translate-y-1/2"
                : "top-1/2 -right-1 h-2 w-2 -translate-y-1/2"
            )}
          />
        )}
      </button>
    </motion.div>
  );
};

const WelcomeBanner = () => {
  const { user } = useUser();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 lg:p-6 xl:p-8 text-white">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 truncate">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm lg:text-base truncate">
            How are you feeling today? Our AI doctors are ready to help.
          </p>
        </div>
        <div className="hidden sm:flex ml-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <IconMicrophone className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActions = ({ totalConsultations, totalDuration }: { totalConsultations: number; totalDuration: string }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 xl:gap-6">
      <div className="bg-white rounded-xl p-3 lg:p-4 xl:p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
            <IconMessage className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 dark:text-white">{totalConsultations}</p>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Total Consultations</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-3 lg:p-4 xl:p-6 shadow-sm border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
            <IconClock className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 dark:text-white">{totalDuration}</p>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Total Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Workspace = () => {
  const { user } = useUser();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/consultations');
        if (response.ok) {
          const data = await response.json();
          const transformedData: Consultation[] = (data.consultations || []).map((consult: any) => ({
            id: consult.id?.toString() || consult.sessionId,
            sessionId: consult.sessionId,
            doctor: consult.report?.agent || consult.selectedDoctor?.specialist || "AI Doctor",
            specialty: consult.selectedDoctor?.specialist || "General Medicine",
            timestamp: consult.createdOn || consult.report?.timestamp || new Date().toISOString(),
            chiefComplaint: consult.report?.chiefComplaint || consult.notes || "No details available",
            consultationDuration: consult.consultationDuration || 0, // Use actual duration
          }));
          setConsultations(transformedData);
        }
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  // Calculate stats using ACTUAL consultation durations
  const totalConsultations = consultations.length;
  const totalDurationMinutes = consultations.reduce((total, consult) => {
    // Use actual consultation duration in seconds, convert to minutes
    return total + Math.round((consult.consultationDuration || 0) / 60);
  }, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl w-full mx-auto p-3 lg:p-4 xl:p-6 flex flex-col gap-4 lg:gap-6 xl:gap-8">
        <WelcomeBanner />
        <AddNewSessionDialog />
        
        <QuickActions 
          totalConsultations={totalConsultations}
          totalDuration={formatDuration(totalDurationMinutes)}
        />

        <ConsultationHistory 
          consultations={consultations} 
          isLoading={isLoading} 
        />

        <DoctorAgentsList doctors={AIDoctorAgents} />
      </div>
    </div>
  );
};

const Logo = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <a href="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white">
      <img
        src="/logo.svg"
        alt="Logo"
        className="h-6 w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 rounded-lg"
      />
      {isOpen && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="font-medium whitespace-pre text-sm lg:text-base"
        >
          Docuvoice
        </motion.span>
      )}
    </a>
  );
};

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconDashboard className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" /> },
    { label: "Profile", href: "/profile", icon: <IconUser className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" /> },
    { label: "Pricing", href: "/pricing", icon: <IconCurrencyDollar className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" /> },
  ];

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices and auto-close sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <div className={cn("flex w-full flex-1 flex-col bg-gray-100 md:flex-row dark:bg-neutral-900", "h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-8 lg:gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo isOpen={open} />
            <div className="mt-4 lg:mt-6 xl:mt-8 flex flex-col gap-1 lg:gap-2">
              {links.map((link, idx) => (
                <CustomSidebarLink
                  key={idx}
                  link={link}
                  isActive={getActiveLink(link.href)}
                  isOpen={open}
                  onClick={() => handleNavigation(link.href)}
                />
              ))}
            </div>
          </div>
          <div>
            {isLoaded && user ? (
              <UserProfileLink
                user={user}
                isActive={getActiveLink("/profile")}
                isOpen={open}
                onClick={() => handleNavigation("/profile")}
              />
            ) : (
              <div className={cn(
                "flex items-center transition-all duration-200 rounded-full",
                open 
                  ? "justify-start gap-3 px-3 py-2.5" 
                  : "justify-center p-2.5"
              )}>
                <div className={cn(
                  "rounded-full bg-gray-300 animate-pulse dark:bg-gray-600",
                  open ? "h-6 w-6 lg:h-7 lg:w-7" : "h-5 w-5 lg:h-6 lg:w-6"
                )} />
                {open && (
                  <div className="h-4 w-20 lg:w-24 bg-gray-300 rounded animate-pulse dark:bg-gray-600"></div>
                )}
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <Workspace />
    </div>
  );
}