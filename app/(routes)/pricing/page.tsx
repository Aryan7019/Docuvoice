"use client";

import { PricingTable } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { Navbar } from '@/app/_components/Navbar';
import { Footer } from '@/app/_components/Footer';

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20 flex-grow">
        {/* Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 rounded-lg"
          >
            <IconArrowLeft className="h-5 w-5" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Docuvoice Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose the plan that fits your professional documentation needs.
          </p>
        </div>

        {/* Clerk Pricing Table */}
        <div className="max-w-6xl mx-auto mb-20">
          <PricingTable />
        </div>

        {/* What's Included Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What's Included
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Voice & AI Features */}
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Voice & AI Features
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Leading-edge voice recognition and AI-driven transcription accuracy.
              </p>
            </div>

            {/* Integration & Workflow */}
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Integration & Workflow
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seamless integration with existing EHRs and workflow automation.
              </p>
            </div>

            {/* Security & Compliance */}
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Security & Compliance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                HIPAA and GDPR compliant with military-grade encryption.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards, debit cards, and digital payment methods through our secure payment processor.
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is my medical data secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely. We use end-to-end encryption and are fully HIPAA compliant. Your data is stored securely and never shared with third parties.
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center bg-cyan-600 rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-cyan-100 text-lg mb-8">
            Join thousands of users who trust DocuVoice for their health consultations
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-white text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
