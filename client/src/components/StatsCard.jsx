import React from 'react';

const colorStyles = {
  blue: {
    border: 'border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/60',
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    glow: 'hover:shadow-md dark:group-hover:shadow-glow-brand',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  },
  emerald: {
    border: 'border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500/60',
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    glow: 'hover:shadow-md dark:group-hover:shadow-glow-success',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
  amber: {
    border: 'border-amber-200 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-500/60',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    glow: 'hover:shadow-md dark:group-hover:shadow-amber-500/20',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  },
  rose: {
    border: 'border-rose-200 dark:border-rose-500/30 hover:border-rose-400 dark:hover:border-rose-500/60',
    iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
    glow: 'hover:shadow-md dark:group-hover:shadow-glow-danger',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
  },
  purple: {
    border: 'border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-500/60',
    iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
    glow: 'hover:shadow-md dark:group-hover:shadow-purple-500/20',
    badge: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
  },
};

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'blue',
  trend,
}) => {
  const styles = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`glass-card group p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${styles.border} ${styles.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${styles.iconBg} transition-transform duration-300 group-hover:scale-110`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
};

export default StatsCard;
