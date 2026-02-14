"use client";

import { useUser, UserButton } from '@clerk/nextjs';
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IconHome, IconStethoscope, IconUser, IconCurrencyDollar, IconMenu2, IconX, IconFileReport, IconHistory, IconMoon, IconSun } from "@tabler/icons-react";

export const Navbar = () => {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    // Check initial dark mode state
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  // Show different nav links based on whether user is on dashboard or home
  const isDashboardArea = pathname?.startsWith('/dashboard') || pathname?.startsWith('/profile') || pathname?.startsWith('/reports') || pathname?.startsWith('/pricing');
  const isHomePage = pathname === '/';

  const dashboardNavLinks = [
    { href: "/dashboard", label: "Dashboard", icon: IconHome },
    { href: "/reports", label: "Reports", icon: IconFileReport },
    { href: "/profile", label: "Profile", icon: IconUser },
    { href: "/pricing", label: "Pricing", icon: IconCurrencyDollar },
  ];

  const navLinks = user ? dashboardNavLinks : [
    { href: "/", label: "Home", icon: IconHome },
    { href: "/pricing", label: "Pricing", icon: IconCurrencyDollar },
  ];

  if (!isLoaded || !isClient) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">DocuVoice</span>
            </div>
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">DocuVoice</span>
          </Link>

          {/* Desktop Navigation - Centered on dashboard pages, Right on home page */}
          <div className={`hidden md:flex items-center gap-4 ${isHomePage && user ? 'ml-auto' : 'absolute left-1/2 transform -translate-x-1/2'}`}>
            {user && (
              <>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 ${
                        isActive(link.href)
                          ? 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
                          : 'text-gray-600 hover:bg-cyan-50 dark:text-gray-400 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <IconSun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <IconMoon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {!user ? (
              <>
                <Link href="/sign-in">
                  <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 rounded-lg">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2">
                    Get Started
                  </button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.firstName || user.fullName || 'User'}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <IconSun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <IconMoon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
            >
              {mobileMenuOpen ? (
                <IconX className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <IconMenu2 className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-neutral-800 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 ${
                      isActive(link.href)
                        ? 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              {!user && (
                <div className="flex flex-col gap-2 mt-4 px-4">
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-all focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 mt-4 border-t border-gray-200 dark:border-neutral-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.firstName || user.fullName || 'User'}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};