"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { 
  IconUser, 
  IconMail, 
  IconCalendar, 
  IconCrown,
  IconStethoscope,
  IconClock,
  IconFileReport,
  IconShieldCheck,
  IconArrowLeft
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import moment from "moment";

interface UserStats {
  totalConsultations: number;
  totalDuration: number;
  lastConsultation: string | null;
  isPremium: boolean;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    totalConsultations: 0,
    totalDuration: 0,
    lastConsultation: null,
    isPremium: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/consultations');
        if (response.ok) {
          const data = await response.json();
          const consultations = data.consultations || [];
          
          // Calculate total duration in minutes
          const totalDuration = consultations.reduce((sum: number, c: any) => {
            return sum + (c.consultationDuration ? Math.round(c.consultationDuration / 60) : 0);
          }, 0);

          // Get last consultation date
          const lastConsultation = consultations.length > 0 
            ? consultations[0].createdOn 
            : null;

          setStats({
            totalConsultations: consultations.length,
            totalDuration,
            lastConsultation,
            isPremium: process.env.NEXT_PUBLIC_ENABLE_FAKE_SUBSCRIPTION === 'true'
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchStats();
    }
  }, [isLoaded, user]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-900/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <IconArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and view your consultation history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
                  />
                  {stats.isPremium && (
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-2 shadow-lg">
                      <IconCrown className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.fullName || "User"}
                </h2>

                {/* Plan Badge */}
                <div className={`px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
                  stats.isPremium 
                    ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {stats.isPremium ? '👑 Premium Member' : '🆓 Free Plan'}
                </div>

                {/* User Info */}
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <IconMail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <IconCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Joined {moment(user.createdAt).format("MMM YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <IconShieldCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Account Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {!stats.isPremium && (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <IconCrown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-semibold text-amber-900 dark:text-amber-400">
                    Upgrade to Premium
                  </h3>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-300 mb-4">
                  Get access to all 9 premium specialists and unlimited consultations
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Consultations */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <IconStethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {loading ? '...' : stats.totalConsultations}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Consultations
                </p>
              </div>

              {/* Total Duration */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <IconClock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {loading ? '...' : formatDuration(stats.totalDuration)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Time
                </p>
              </div>

              {/* Last Consultation */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <IconFileReport className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {loading ? '...' : stats.lastConsultation ? moment(stats.lastConsultation).fromNow() : 'Never'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last Consultation
                </p>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IconUser className="h-5 w-5 text-blue-600" />
                Account Details
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-neutral-700">
                  <span className="text-gray-600 dark:text-gray-400">Full Name</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user.fullName || 'Not set'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-neutral-700">
                  <span className="text-gray-600 dark:text-gray-400">Email Address</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user.primaryEmailAddress?.emailAddress}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-neutral-700">
                  <span className="text-gray-600 dark:text-gray-400">Account Type</span>
                  <span className={`font-medium ${stats.isPremium ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                    {stats.isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-neutral-700">
                  <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {moment(user.createdAt).format("MMMM D, YYYY")}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 dark:text-gray-400">User ID</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {user.id.slice(0, 12)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IconFileReport className="h-5 w-5 text-blue-600" />
                Activity Summary
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Consultations This Month</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track your monthly usage</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {loading ? '...' : stats.totalConsultations}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Available Specialists</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.isPremium ? 'All specialists unlocked' : 'General Physician only'}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.isPremium ? '10' : '1'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
