import React from 'react';
import { AlertCircle, AlertTriangle, Flame, Info } from 'lucide-react';

const priorityConfig = {
  Low: {
    bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    icon: Info,
    iconColor: 'text-slate-500 dark:text-slate-400',
  },
  Medium: {
    bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    icon: AlertCircle,
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
  High: {
    bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    icon: AlertTriangle,
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  Critical: {
    bg: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/70 shadow-sm dark:shadow-glow-danger',
    icon: Flame,
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
};

export const PriorityBadge = ({ priority = 'Medium', size = 'md' }) => {
  const config = priorityConfig[priority] || priorityConfig['Medium'];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border ${config.bg} ${sizeClasses[size]} font-semibold uppercase tracking-wider`}
    >
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${config.iconColor}`} />
      <span>{priority}</span>
    </span>
  );
};

export default PriorityBadge;
