import React from 'react';
import {
  FileText,
  Eye,
  UserCheck,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const statusConfig = {
  Submitted: {
    bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
    dot: 'bg-sky-500 dark:bg-sky-400',
    icon: FileText,
  },
  'Under Review': {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    dot: 'bg-indigo-500 dark:bg-indigo-400',
    icon: Eye,
  },
  Assigned: {
    bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    dot: 'bg-amber-500 dark:bg-amber-400',
    icon: UserCheck,
  },
  'In Progress': {
    bg: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
    dot: 'bg-orange-500 dark:bg-orange-400',
    icon: Clock,
  },
  Resolved: {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    icon: CheckCircle2,
  },
  Closed: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
    dot: 'bg-slate-500 dark:bg-slate-400',
    icon: Lock,
  },
};

export const StatusBadge = ({ status = 'Submitted', size = 'md' }) => {
  const config = statusConfig[status] || statusConfig['Submitted'];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]} tracking-wide shadow-sm font-medium`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
