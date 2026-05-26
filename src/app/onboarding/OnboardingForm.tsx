"use client";

import { useOnboardingStore } from "@/store/onboarding";
import { Progress } from "@/components/ui/progress";
import { StepPersonal } from "./StepPersonal";
import { StepBusiness } from "./StepBusiness";
import { StepOffer } from "./StepOffer";
import { StepNeed } from "./StepNeed";
import { StepPreview } from "./StepPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const labels = ["Personal", "Business", "Offer Skills", "Need Skills", "Preview"];

export function OnboardingForm() {
  const { step, setStep } = useOnboardingStore();
  const progress = ((step + 1) / labels.length) * 100;

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-12 overflow-x-hidden">
      <div className="w-full max-w-xl my-auto overflow-x-hidden">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {step + 1} of {labels.length}
            </span>
            <span>{labels[step]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {step > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(step - 1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        )}

        {step === 0 && <StepPersonal />}
        {step === 1 && <StepBusiness />}
        {step === 2 && <StepOffer />}
        {step === 3 && <StepNeed />}
        {step === 4 && <StepPreview />}
      </div>
    </div>
  );
}
