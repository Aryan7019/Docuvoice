import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { IconStethoscope, IconShieldCheck, IconSparkles, IconClock } from "@tabler/icons-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50 dark:from-neutral-950 dark:via-cyan-950/20 dark:to-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Sign In Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-800 p-8 md:p-12">
              {/* Logo for mobile */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">DocuVoice</span>
              </div>

              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  Welcome Back
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Continue your healthcare journey with us
                </p>
              </div>
              
              <SignIn 
                routing="path"
                path="/sign-in"
                forceRedirectUrl="/dashboard" 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none border-0 p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-xl",
                    socialButtonsBlockButtonText: "text-gray-700 dark:text-gray-300 font-medium",
                    formButtonPrimary: "bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-lg rounded-xl py-3",
                    formFieldInput: "bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-white rounded-xl",
                    formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium",
                    footerActionLink: "text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-semibold",
                    identityPreviewText: "text-gray-700 dark:text-gray-300",
                    identityPreviewEditButton: "text-cyan-600 hover:text-cyan-700",
                    formFieldInputShowPasswordButton: "text-gray-600 dark:text-gray-400",
                    otpCodeFieldInput: "border-gray-300 dark:border-neutral-700 rounded-xl",
                    formResendCodeLink: "text-cyan-600 hover:text-cyan-700",
                    dividerLine: "bg-gray-200 dark:bg-neutral-700",
                    dividerText: "text-gray-500 dark:text-gray-400",
                  },
                }}
              />
            </div>
          </div>

          {/* Right Side - Branding & Features */}
          <div className="order-1 lg:order-2">
            <div className="text-center lg:text-left">
              {/* Logo for desktop */}
              <Link href="/" className="hidden lg:flex items-center gap-3 mb-8">
                <img src="/logo.png" alt="Logo" className="h-20 w-20 object-contain" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">DocuVoice</span>
              </Link>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Your Health,
                <br />
                <span className="text-cyan-600">Simplified</span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                Access intelligent medical consultations powered by advanced AI technology
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-800">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex-shrink-0">
                    <IconStethoscope className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">10+ Medical Specialists</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">From general physicians to specialized doctors</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-800">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex-shrink-0">
                    <IconClock className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Available Anytime</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get medical advice whenever you need it</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-800">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex-shrink-0">
                    <IconShieldCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Secure & Private</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your health data is fully encrypted and protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}