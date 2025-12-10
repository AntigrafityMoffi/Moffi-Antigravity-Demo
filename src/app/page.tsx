"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/auth/SplashScreen";
import { Onboarding } from "@/components/auth/Onboarding";
import { AuthLanding, LoginForm, SignupForm, ResetForm } from "@/components/auth/AuthForms";
import { SetupWizard } from "@/components/auth/SetupWizard";

type FlowStep = 'splash' | 'onboarding' | 'landing' | 'login' | 'signup' | 'reset' | 'setup';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>('splash');

  // Splash completion handler
  const handleSplashComplete = () => {
    setStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setStep('landing');
  };

  const handleSetupComplete = () => {
    router.push('/home');
  };

  // Render Logic
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden relative">

        {step === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}

        {step === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}

        {/* Auth Stack */}
        {step === 'landing' && <AuthLanding setView={(v) => setStep(v as FlowStep)} />}
        {step === 'login' && <LoginForm setView={(v) => setStep(v as FlowStep)} onComplete={() => router.push('/home')} />}
        {step === 'signup' && <SignupForm setView={(v) => setStep(v as FlowStep)} onComplete={() => setStep('setup')} />}
        {step === 'reset' && <ResetForm setView={(v) => setStep(v as FlowStep)} />}

        {/* Setup Stack */}
        {step === 'setup' && <SetupWizard onComplete={handleSetupComplete} />}

      </div>
    </main>
  );
}
