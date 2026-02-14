"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Navbar } from "./_components/Navbar";
import { Footer } from "./_components/Footer";
import { IconStethoscope, IconClock, IconShieldCheck, IconCheck, IconSparkles, IconMicrophone, IconFileReport, IconUsers, IconHeartbeat } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white dark:bg-neutral-950">
      <Navbar />
      
      {/* Hero Section with Colorful Gradient */}
      <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-neutral-950 dark:via-blue-950/20 dark:to-neutral-950 pt-20 overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="px-4 py-20 md:py-28 max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-full border border-cyan-200 dark:border-cyan-800"
              >
                <span className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">⚡ AI-POWERED HEALTHCARE</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                AI-Powered Health.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-700">
                  On Demand.
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Anytime, Anywhere.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Experience next-generation healthcare with AI-powered medical consultations. Get instant symptom analysis, personalized treatment plans, and connect with specialized virtual doctors anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/sign-up">
                  <button className="group px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
                    <span className="flex items-center gap-2">
                      Get Started Free →
                    </span>
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="px-8 py-4 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-neutral-700 rounded-xl font-semibold hover:border-cyan-600 dark:hover:border-cyan-600 transition-all duration-300">
                    View Pricing
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-2 border-white dark:border-neutral-900"></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">1000+ users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">4.9/5 rating</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Doctor Images Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-neutral-900 dark:to-blue-950/30 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-neutral-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                      <img 
                        src="/doctor1.png" 
                        alt="General Physician" 
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="eager"
                        onError={(e) => { 
                          console.error('Failed to load doctor1.png');
                          e.currentTarget.src = '/doctor1.png'; 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full w-fit">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          Available Now
                        </div>
                      </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                      <img 
                        src="/doctor6.png" 
                        alt="Cardiologist" 
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="eager"
                        onError={(e) => { 
                          console.error('Failed to load doctor6.png for Cardiologist');
                          e.currentTarget.src = '/doctor1.png'; 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full w-fit">
                          <IconHeartbeat className="w-3 h-3" />
                          Cardiologist
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                      <img 
                        src="/doctor2.png" 
                        alt="Pediatrician" 
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="eager"
                        onError={(e) => { 
                          console.error('Failed to load doctor2.png');
                          e.currentTarget.src = '/doctor1.png'; 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full w-fit">
                          <IconStethoscope className="w-3 h-3" />
                          General
                        </div>
                      </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                      <img 
                        src="/doctor4.png" 
                        alt="Psychologist" 
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="eager"
                        onError={(e) => { 
                          console.error('Failed to load doctor4.png');
                          e.currentTarget.src = '/doctor1.png'; 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full w-fit">
                          <IconUsers className="w-3 h-3" />
                          Pediatrician
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                      <IconCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Comprehensive Healthcare Solutions */}
      <div className="w-full py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Healthcare Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Advanced AI technology meets personalized medical care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - Comprehensive Care */}
            <div className="group bg-white dark:bg-neutral-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-neutral-800 hover:border-cyan-600 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IconStethoscope className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Personalized Care Plans
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Receive customized health recommendations and treatment strategies designed specifically for your unique needs.
              </p>
            </div>

            {/* Card 2 - Voice Connection */}
            <div className="group bg-white dark:bg-neutral-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-neutral-800 hover:border-cyan-600 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IconMicrophone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Voice-Powered Consultations
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Speak naturally with AI doctors using advanced voice recognition for effortless medical conversations.
              </p>
            </div>

            {/* Card 3 - Transparency & Support */}
            <div className="group bg-white dark:bg-neutral-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-neutral-800 hover:border-cyan-600 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IconShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Your health data is protected with enterprise-grade encryption and HIPAA-compliant security measures.
              </p>
            </div>

            {/* Card 4 - Symptom Checker */}
            <div className="group bg-white dark:bg-neutral-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-neutral-800 hover:border-cyan-600 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IconHeartbeat className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                AI Symptom Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Intelligent symptom evaluation powered by machine learning for accurate health assessments.
              </p>
            </div>

            {/* Card 5 - Medical Reports */}
            <div className="group bg-white dark:bg-neutral-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-neutral-800 hover:border-cyan-600 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IconFileReport className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Detailed Health Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Access comprehensive medical documentation and track your health progress over time.
              </p>
            </div>

            {/* Card 6 - Doctor Recommendations */}
            <div className="group bg-white dark:bg-neutral-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-neutral-800 hover:border-cyan-600 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IconUsers className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Specialist Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Connect with the perfect medical specialist based on your symptoms and health concerns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="w-full py-20 bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How DocuVoice Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to better health
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Share Your Symptoms",
                description: "Describe what you're experiencing through voice or text - our AI understands natural conversation.",
                icon: IconMicrophone
              },
              {
                step: "2",
                title: "Get Expert Analysis",
                description: "Receive intelligent health insights and recommendations from our specialized AI doctors.",
                icon: IconHeartbeat
              },
              {
                step: "3",
                title: "Round-the-Clock Access",
                description: "Healthcare support whenever you need it - day or night, from anywhere in the world.",
                icon: IconClock
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-neutral-700 hover:border-cyan-600 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-bold rounded-full mb-4">
                    Step {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-20 bg-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-600 opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
              <IconSparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready to Experience Smarter Healthcare?
            </h2>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
              Join our community and discover a better way to manage your health
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/sign-up">
                <button className="px-10 py-4 bg-white text-cyan-600 rounded-xl font-semibold hover:bg-cyan-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Begin Your Free Consultation
                </button>
              </Link>
              <Link href="/pricing">
                <button className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
                  Explore Plans
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
