import React from 'react';
import { ComplaintPriority } from '../../types';

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const getConfig = (p: ComplaintPriority) => {
    switch (p) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeClass = size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center rounded border font-medium uppercase tracking-wider ${getConfig(
        priority
      )} ${sizeClass}`}
    >
      {priority}
    </span>
  );
};
