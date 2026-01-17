import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WizardStepperProps {
    currentStep: number;
    steps: string[];
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
    return (
        <div className="w-full max-w-4xl mx-auto py-6 px-4">
            <div className="flex items-center justify-between relative">
                {/* Background Line */}
                <div className="absolute top-[15px] left-0 w-full h-[2px] bg-slate-100 -z-10" />

                {/* Progress Line */}
                <div
                    className="absolute top-[15px] left-0 h-[2px] bg-green-600 -z-10 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <div key={step} className="flex flex-col items-center relative group cursor-default">
                            {/* Step Circle */}
                            <div
                                className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 z-10",
                                    isActive
                                        ? "bg-black text-white border-black scale-110" // Active
                                        : isCompleted
                                            ? "bg-green-600 text-white border-green-600" // Completed
                                            : "bg-white text-slate-300 border-slate-200" // Inactive
                                )}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                            </div>

                            {/* Step Label */}
                            <span className={cn(
                                "absolute top-10 w-32 text-center text-xs md:text-sm font-medium transition-colors duration-300",
                                isActive ? "text-black font-bold" : isCompleted ? "text-green-600" : "text-slate-400"
                            )}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
