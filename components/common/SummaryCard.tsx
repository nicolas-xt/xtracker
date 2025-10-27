import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  colorClass?: string;
  subValue?: string;
  className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, colorClass = 'text-b-text-1', subValue, className = '' }) => {
  return (
    <div className={`bg-b-dark-2 border border-b-border rounded-md p-4 flex flex-col ${className}`}>
      <p className="text-sm text-b-text-2 mb-2 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline">
        <p className={`text-3xl font-semibold ${colorClass}`}>{value}</p>
        {subValue && <p className="text-xs text-b-text-2 ml-2">{subValue}</p>}
      </div>
    </div>
  );
};