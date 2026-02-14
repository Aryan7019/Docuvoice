"use client";

import { useEffect } from 'react';

export const ErrorSuppressor = () => {
  useEffect(() => {
    // Suppress browser extension errors only
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || '';
      
      // Check if it's a browser extension error or VAPI meeting end error
      if (
        (errorMessage.includes('Could not establish connection') &&
        errorMessage.includes('Receiving end does not exist')) ||
        errorMessage.includes('Meeting ended due to ejection') ||
        errorMessage.includes('Meeting has ended')
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || event.reason?.toString() || '';
      
      // Check if it's a browser extension error or VAPI meeting end error
      if (
        (errorMessage.includes('Could not establish connection') &&
        errorMessage.includes('Receiving end does not exist')) ||
        errorMessage.includes('Meeting ended due to ejection') ||
        errorMessage.includes('Meeting has ended')
      ) {
        event.preventDefault();
        return;
      }
    };

    // Override console.error to suppress VAPI meeting end errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args[0]?.toString() || '';
      
      // Suppress VAPI meeting end errors
      if (
        errorMessage.includes('Meeting ended due to ejection') ||
        errorMessage.includes('Meeting has ended')
      ) {
        return;
      }
      
      // Allow all other errors
      originalConsoleError.apply(console, args);
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.error = originalConsoleError;
    };
  }, []);

  return null;
};
