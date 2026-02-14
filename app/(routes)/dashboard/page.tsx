"use client";

import React, { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { IconStethoscope, IconClock, IconCrown, IconTrendingUp, IconTrendingDown, IconCalendarPlus, IconFileReport, IconUserCircle, IconSparkles } from "@tabler/icons-react";
import { Navbar } from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";
import AddNewSessionDialog from "./components/AddNewSessionDialog";
import DoctorAgentsList from "./components/DoctorAgentsList";
import { AIDoctorAgents } from "./components/list";
import { Consultation } from "./components/ConsultationHistory";
import Link from "next/link";
import moment from "moment";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { WobbleCard } from "@/components/ui/wobble-card";

const loadingStates = [
  { text: "Connecting to database..." },
  { text: "Fetching your consultations..." },
  { text: "Loading doctor specialists..." },
  { text: "Calculating analytics..." },
  { text: "Preparing your dashboard..." },
];

const WelcomeBanner = () => {
  const { user } = useUser();

  return (
    <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-700/10"></div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
            <IconStethoscope className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-cyan-100 text-sm sm:text-base">
              Your AI health companion is ready to help you today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = React.memo(({ consultations }: { consultations: Consultation[] }) => {
  const recentConsultations = consultations.slice(0, 5);

  const getDoctorInfo = (consultation: Consultation) => {
    try {
      const selectedDoctor = typeof consultation.selectedDoctor === 'string'
        ? JSON.parse(consultation.selectedDoctor)
        : consultation.selectedDoctor;
      return selectedDoctor?.specialist || selectedDoctor?.name || "AI Doctor";
    } catch (error) {
      return "AI Doctor";
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <IconClock className="h-5 w-5 text-cyan-600" />
          Recent Activity
        </h3>
        <Link href="/reports">
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </div>
      {recentConsultations.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <IconStethoscope className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No recent consultations</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentConsultations.map((consultation) => (
            <div key={consultation.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <IconStethoscope className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {getDoctorInfo(consultation)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {moment(consultation.createdOn).fromNow()}
                </p>
              </div>
              <Link href="/reports">
                <button className="text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium">
                  View
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Mini sparkline component
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-16" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const AnalyticsCards = ({ 
  totalConsultations, 
  totalDuration, 
  isPro,
  consultations 
}: { 
  totalConsultations: number; 
  totalDuration: string;
  isPro: boolean;
  consultations: Consultation[];
}) => {
  // Generate trend data (last 7 days)
  const generateTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toDateString();
    });

    return last7Days.map(day => {
      return consultations.filter(c => 
        new Date(c.createdOn).toDateString() === day
      ).length;
    });
  };

  const trendData = generateTrendData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Consultations Card */}
      <WobbleCard containerClassName="col-span-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 min-h-[200px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Consultations</span>
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <IconTrendingUp className="h-3 w-3" />
              +12%
            </span>
          </div>
          <div className="mb-4">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{totalConsultations}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">All time sessions</p>
          </div>
          <div className="mt-4">
            <Sparkline data={trendData} color="#10b981" />
          </div>
        </div>
      </WobbleCard>

      {/* Total Time Card */}
      <WobbleCard containerClassName="col-span-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 min-h-[200px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Time</span>
            <span className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400">
              <IconTrendingUp className="h-3 w-3" />
              +8%
            </span>
          </div>
          <div className="mb-4">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{totalDuration}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Consultation time</p>
          </div>
          <div className="mt-4">
            <Sparkline data={trendData.map(v => v * 5)} color="#3b82f6" />
          </div>
        </div>
      </WobbleCard>

      {/* Plan Status Card */}
      <WobbleCard containerClassName={`col-span-1 border min-h-[200px] ${
        isPro 
          ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400' 
          : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium uppercase tracking-wide ${
              isPro ? 'text-amber-100' : 'text-gray-600 dark:text-gray-400'
            }`}>Plan Status</span>
            {isPro && <IconCrown className="h-5 w-5 text-amber-100" />}
          </div>
          <div className="mb-4">
            <h3 className={`text-4xl font-bold mb-1 ${isPro ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {isPro ? 'Pro' : 'Free'}
            </h3>
            <p className={`text-sm ${isPro ? 'text-amber-100' : 'text-gray-500 dark:text-gray-400'}`}>
              {isPro ? 'All features unlocked' : 'Limited access'}
            </p>
          </div>
          {!isPro && (
            <Link href="/pricing">
              <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all text-sm">
                Upgrade to Pro
              </button>
            </Link>
          )}
          {isPro && (
            <div className="mt-4 flex items-center gap-2 text-amber-100 text-sm">
              <div className="w-2 h-2 bg-amber-100 rounded-full animate-pulse"></div>
              Active subscription
            </div>
          )}
        </div>
      </WobbleCard>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useUser();
  const { has } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isPro = has ? has({ plan: 'pro' }) : false;

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
            createdBy: consult.createdBy,
            notes: consult.notes,
            selectedDoctor: consult.selectedDoctor,
            report: consult.report,
            conversation: consult.conversation,
            createdOn: consult.createdOn,
            consultationDuration: consult.consultationDuration,
            callStartedAt: consult.callStartedAt,
            callEndedAt: consult.callEndedAt,
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

  // Calculate stats
  const totalConsultations = consultations.length;
  const totalDurationMinutes = consultations.reduce((total, consult) => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col">
      <Navbar />
      
      <MultiStepLoader loadingStates={loadingStates} loading={isLoading} duration={1000} loop={true} />
      
      <div className="pt-20 pb-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <WelcomeBanner />
            
            <AnalyticsCards 
              totalConsultations={totalConsultations}
              totalDuration={formatDuration(totalDurationMinutes)}
              isPro={isPro}
              consultations={consultations}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="hidden lg:block">
                <RecentActivity consultations={consultations} />
              </div>
              <div className="lg:col-span-1">
                <AddNewSessionDialog />
              </div>
            </div>

            <DoctorAgentsList doctors={AIDoctorAgents} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}