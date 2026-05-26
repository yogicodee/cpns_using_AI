/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    labelText: string;
    isPositive?: boolean;
  };
  colorClassName?: string;
  id?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorClassName = "border-slate-200 bg-white shadow-sm",
  id,
}) => {
  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-xl border p-4.5 transition-all duration-350 hover:shadow-md hover:border-slate-300 ${colorClassName}`}
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-500/[0.03] blur-2xl" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100/60 shadow-sm">
          {icon}
        </div>
      </div>

      <div className="mt-3.5">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl.5 font-bold tracking-tight text-slate-900">{value}</span>
          {trend && (
            <span
              className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                trend.isPositive ? 'bg-emerald-500/10 text-emerald-700' : 'bg-rose-500/10 text-rose-700'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );
};
