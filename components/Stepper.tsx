'use client';

import React from 'react';
import { StepType } from '@/types/presentation';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: StepType;
}

export default function Stepper({ currentStep }: StepperProps) {
  const steps: { number: StepType; label: string; shortLabel: string }[] = [
    { number: 1, label: 'Tải lên', shortLabel: 'Tải lên' },
    { number: 2, label: 'Phân tích & lập dàn ý', shortLabel: 'Dàn ý' },
    { number: 3, label: 'Tạo lời giảng/Quiz', shortLabel: 'Lời giảng' },
    { number: 4, label: 'Đóng gói E-learning', shortLabel: 'Đóng gói' },
  ];

  const activeStep = steps.find((s) => s.number === currentStep) || steps[0];

  return (
    <div className="w-full py-2.5 sm:py-3.5 px-3 sm:px-6 border-b border-slate-800/80 bg-[#0d1424]/95 backdrop-blur-sm sticky top-16 z-20 select-none">
      {/* Mobile Stepper Header (< sm) */}
      <div className="sm:hidden flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px] shadow-sm">
              {currentStep}
            </span>
            <span className="font-semibold text-white tracking-tight">
              {activeStep.label}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Bước {currentStep}/4
          </span>
        </div>

        {/* 4-Segment Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          {steps.map((s) => (
            <div
              key={s.number}
              className={`rounded-full transition-all duration-300 ${
                currentStep === s.number
                  ? 'bg-amber-500 shadow-sm shadow-amber-500/30'
                  : currentStep > s.number
                  ? 'bg-blue-600'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop & Tablet Stepper (>= sm) */}
      <div className="hidden sm:flex max-w-4xl mx-auto items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[2px] bg-slate-800 -z-0" />

        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isDone = currentStep > step.number;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center gap-1.5 relative z-10 select-none cursor-default"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isActive
                    ? 'bg-amber-600 text-white ring-4 ring-amber-500/20 scale-105'
                    : isDone
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.number}
              </div>

              <span
                className={`text-[11px] sm:text-xs font-medium tracking-tight text-center max-w-[120px] ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : isDone
                    ? 'text-slate-300'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
