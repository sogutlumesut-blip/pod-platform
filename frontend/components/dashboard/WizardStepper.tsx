import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WizardStepperProps {
    currentStep: number;
    steps: string[];
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
    return (
        <div className="flex items-center justify-center w-full max-w-4xl mx-auto py-8">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <div key={step} className="flex items-center">
                        {/* Step Circle */}
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                                    isActive
                                        ? "bg-[#6BCFA4] text-white"
                                        : isCompleted
                                            ? "bg-[#6BCFA4] text-white"
                                            : "bg-muted text-muted-foreground"
                                )}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                            </div>
                            <span className={cn("font-bold text-sm hidden md:block", isActive || isCompleted ? "text-foreground" : "text-muted-foreground")}>
                                {step}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="h-[2px] w-12 md:w-24 bg-muted mx-4 relative">
                                <div className={cn("absolute inset-0 bg-[#6BCFA4] transition-all duration-300", isCompleted ? "w-full" : "w-0")} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
