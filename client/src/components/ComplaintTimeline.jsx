import React from 'react';
import { Check, CircleDot } from 'lucide-react';

const steps = [
  { key: 'Submitted', label: 'Submitted', desc: 'Ticket logged by student' },
  { key: 'Under Review', label: 'Under Review', desc: 'Admin evaluating severity' },
  { key: 'Assigned', label: 'Assigned', desc: 'Department/Staff dispatched' },
  { key: 'In Progress', label: 'In Progress', desc: 'Work actively ongoing' },
  { key: 'Resolved', label: 'Resolved', desc: 'Solution verified' },
  { key: 'Closed', label: 'Closed', desc: 'Case officially closed' },
];

export const ComplaintTimeline = ({ currentStatus = 'Submitted' }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const activeIdx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-4">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background Connecting Bar */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
        
        {/* Active Connecting Bar */}
        <div
          className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-sky-500 via-brand-500 to-emerald-500 -z-0 transition-all duration-700 ease-out"
          style={{
            width: `${(activeIdx / (steps.length - 1)) * 92}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10 group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm ring-4 ring-white dark:ring-slate-950'
                    : isCurrent
                    ? 'bg-brand-600 dark:bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-500/30 shadow-md animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 ring-4 ring-white dark:ring-slate-950'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : isCurrent ? (
                  <CircleDot className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <div className="mt-2.5 text-center">
                <p
                  className={`text-xs font-semibold tracking-wide ${
                    isCurrent
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[100px] hidden lg:block">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-4 relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div key={step.key} className="relative flex items-start space-x-3">
              <div
                className={`absolute -left-[31px] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCompleted
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-brand-600 dark:bg-brand-500 text-white ring-2 ring-brand-200 dark:ring-brand-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <CircleDot className="w-3.5 h-3.5" />
                ) : (
                  idx + 1
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isCurrent
                      ? 'text-brand-600 dark:text-brand-400'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintTimeline;
