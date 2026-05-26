/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AICoachInsights } from '../types.js';
import { AlertCircle, Brain, Sparkles, Target, Zap, CheckCircle2, Award, Calendar, RefreshCcw } from 'lucide-react';

interface AIRecommendationsProps {
  id?: string;
  refreshTrigger: number;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ id, refreshTrigger }) => {
  const [insights, setInsights] = useState<AICoachInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/analytics/ai-insights');
      const json = await res.json();
      if (json.success && json.data) {
        setInsights(json.data);
      } else {
        setError(json.message || 'Gagal memuat rekomendasi AI');
      }
    } catch (err: any) {
      setError('Sambungan jaringan gagal saat menghubungi AI Coach.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [refreshTrigger]);

  const getPriorityBadge = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (priority) {
      case 'HIGH':
        return <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">Prioritas Tinggi</span>;
      case 'MEDIUM':
        return <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">Prioritas Sedang</span>;
      case 'LOW':
        return <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">Prioritas Stabil</span>;
    }
  };

  if (loading) {
    return (
      <div id={id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-lg bg-indigo-100 animate-pulse" />
            <div className="h-6 w-36 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="mt-6 space-y-4">
          <div className="h-16 w-full bg-slate-100/50 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-28 bg-slate-100/50 rounded-xl animate-pulse" />
            <div className="h-28 bg-slate-100/50 rounded-xl animate-pulse" />
            <div className="h-28 bg-slate-100/50 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id={id} className="rounded-xl border border-rose-200 bg-rose-50/30 p-6 flex flex-col items-center text-center">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h3 className="mt-3 text-lg font-bold text-slate-900">Gagal Membuka Coach AI</h3>
        <p className="mt-1 text-sm text-slate-600 max-w-md">{error}</p>
        <button
          onClick={fetchInsights}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition cursor-pointer"
        >
          <RefreshCcw className="h-4 w-4" /> Coba Lagi
        </button>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div id={id} className="rounded-xl border border-slate-200 bg-white p-5.5 shadow-sm relative overflow-hidden backdrop-blur-md">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-50/45 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-slate-100/40 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base.5 font-extrabold text-slate-900 flex items-center gap-2">
              Virtual Coach AI SKD CPNS
            </h3>
            <p className="text-xs text-slate-500 font-medium">Rekomendasi belajar adaptif dari Gemini 3.5 AI</p>
          </div>
        </div>

        {/* Scaled passing chance badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 flex items-center gap-3 self-start sm:self-center shadow-sm">
          <div className="text-right">
            <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Peluang Lolos SKD</span>
            <span className="font-mono text-base.5 font-extrabold text-indigo-600">{insights.predictedPassingChance}%</span>
          </div>
          <div className="relative flex h-10 w-10 items-center justify-center">
            <svg className="absolute top-0 left-0 h-full w-full rotate-[-90deg]">
              <circle cx="20" cy="20" r="16" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="transparent"
                stroke="#4f46e5"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - insights.predictedPassingChance / 100)}`}
              />
            </svg>
            <Brain className="h-4 w-4 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Overall evaluation */}
      <div className="mt-4 bg-indigo-50/50 border border-indigo-100/60 rounded-xl p-4 animate-fade-in">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/60 px-2.5 py-0.5 text-[10px] font-bold text-indigo-750 mb-2">
          <Target className="h-3 w-3" /> Evaluasi Menyeluruh
        </span>
        <p className="text-xs.5 leading-relaxed text-slate-700 font-medium">{insights.overallEvaluation}</p>
      </div>

      {/* Category breakdown grids */}
      <h4 className="mt-5.5 font-bold text-slate-800 text-xs.5 uppercase tracking-wide">Analisis Kategori SKD CPNS</h4>
      <div className="mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TWK Card */}
        <div className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-4 hover:border-slate-300 transition shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">TWK (Kebangsaan)</span>
            {getPriorityBadge(insights.categoryBreakdown.twk.priority)}
          </div>
          <p className="mt-2 text-xs text-slate-500 min-h-[44px] leading-relaxed font-semibold">
            {insights.categoryBreakdown.twk.analysis}
          </p>
          <div className="mt-3.5 space-y-1.5 border-t border-slate-100/50 pt-2.5">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Topik Rekomendasi:</span>
            {insights.categoryBreakdown.twk.actionableTopics.map((topic, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 font-semibold leading-tight">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TIU Card */}
        <div className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-4 hover:border-slate-300 transition shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">TIU (Inteligensia)</span>
            {getPriorityBadge(insights.categoryBreakdown.tiu.priority)}
          </div>
          <p className="mt-2 text-xs text-slate-500 min-h-[44px] leading-relaxed font-semibold">
            {insights.categoryBreakdown.tiu.analysis}
          </p>
          <div className="mt-3.5 space-y-1.5 border-t border-slate-100/50 pt-2.5">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Topik Rekomendasi:</span>
            {insights.categoryBreakdown.tiu.actionableTopics.map((topic, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 font-semibold leading-tight">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TKP Card */}
        <div className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-4 hover:border-slate-300 transition shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">TKP (Karakteristik)</span>
            {getPriorityBadge(insights.categoryBreakdown.tkp.priority)}
          </div>
          <p className="mt-2 text-xs text-slate-500 min-h-[44px] leading-relaxed font-semibold">
            {insights.categoryBreakdown.tkp.analysis}
          </p>
          <div className="mt-3.5 space-y-1.5 border-t border-slate-100/50 pt-2.5">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Topik Rekomendasi:</span>
            {insights.categoryBreakdown.tkp.actionableTopics.map((topic, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 font-semibold leading-tight">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="mt-5.5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-150 bg-slate-50 p-4">
          <span className="flex items-center gap-1.5 text-emerald-700 text-xs font-extrabold uppercase tracking-wide mb-2.5">
            <Award className="h-4 w-4 text-emerald-600" /> Keunggulan Utama Anda
          </span>
          <ul className="space-y-1.5">
            {insights.keyStrengths.map((s, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-150 bg-slate-50 p-4">
          <span className="flex items-center gap-1.5 text-rose-700 text-xs font-extrabold uppercase tracking-wide mb-2.5">
            <Zap className="h-4 w-4 text-rose-600" /> Area Butuh Perbaikan
          </span>
          <ul className="space-y-1.5">
            {insights.keyWeaknesses.map((w, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested 3-day action plan */}
      <div className="mt-5.5 border-t border-slate-100 pt-4.5">
        <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs uppercase tracking-wider mb-3">
          <Calendar className="h-4 w-4 text-indigo-600" />
          <span>Timeline Rencana Latihan 3 Hari Ke Depan</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.recommendedDailyPlan.map((plan, i) => (
            <div key={i} className="flex gap-3 items-start bg-[#fcfdfe] rounded-xl p-3 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
              <span className="flex items-center justify-center text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 h-6 w-6 rounded-lg flex-shrink-0 shadow-xs">
                {i + 1}
              </span>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">{plan}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
