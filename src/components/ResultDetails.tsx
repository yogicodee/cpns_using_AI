/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TryoutResult } from '../types.js';
import { Award, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

interface ResultDetailsProps {
  result: TryoutResult;
  id?: string;
}

export const ResultDetails: React.FC<ResultDetailsProps> = ({ result, id }) => {
  // Constants
  const PASSING_TWK = 65;
  const PASSING_TIU = 80;
  const PASSING_TKP = 166;

  const twkScore = result.scores.twk;
  const tiuScore = result.scores.tiu;
  const tkpScore = result.scores.tkp;

  const twkPercent = Math.min(100, Math.round((twkScore / 150) * 100));
  const tiuPercent = Math.min(100, Math.round((tiuScore / 175) * 100));
  const tkpPercent = Math.min(100, Math.round((tkpScore / 225) * 100));

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div id={id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Upper Status Banner */}
      <div className={`p-5 ${result.isPassed ? 'bg-emerald-50/50 border-b border-emerald-100' : 'bg-rose-50/50 border-b border-rose-100'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Hasil Analisis Ujian</span>
            <h4 className="text-lg font-bold text-slate-800 mt-1">{result.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Dikerjakan pada {formatDate(result.submittedAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {result.isPassed ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-100/80 border border-emerald-200 px-3.5 py-1.5 shadow-xs">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <div>
                  <span className="block text-[8px] uppercase tracking-wider font-extrabold text-emerald-700">Hasil Evaluasi</span>
                  <span className="text-xs font-black text-emerald-800">LULUS PASSING GRADE</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-rose-100/80 border border-rose-200 px-3.5 py-1.5 shadow-xs">
                <XCircle className="h-5 w-5 text-rose-600" />
                <div>
                  <span className="block text-[8px] uppercase tracking-wider font-extrabold text-rose-700">Hasil Evaluasi</span>
                  <span className="text-xs font-black text-rose-800">GELAR TIDAK AMAN (FAIL)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Core Breakdown */}
      <div className="p-5 space-y-5">
        {/* Statistics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-center shadow-xs">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Akurasi Jawaban</span>
            <span className="block text-xl font-bold font-mono text-slate-800 mt-1">
              {result.correctAnswers} / 110
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Dikerjakan dengan Benar</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-center shadow-xs">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Kecepatan Pengerjaan</span>
            <span className="block text-xl font-bold font-mono text-indigo-600 mt-1 flex items-center justify-center gap-1">
              <Clock className="h-4.5 w-4.5 text-indigo-500" /> {formatDuration(result.durationSeconds)}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Rataan: {Math.round(result.durationSeconds / 110)} detik per soal</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-center shadow-xs">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Skor Total Akhir</span>
            <span className="block text-2xl font-black font-mono text-slate-900 mt-0.5">
              {result.totalScore}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold font-mono">Maks: 550</span>
          </div>
        </div>

        {/* Categories Analysis */}
        <div className="space-y-3.5">
          <h5 className="text-xs font-black text-slate-500 uppercase tracking-wider">Nilai Sub-Kategori SKD</h5>

          {/* TKP */}
          <div className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-4 shadow-xs">
            <div className="flex items-center justify-between font-bold text-xs text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-black flex items-center justify-center text-[9px]">TKP</span>
                Tes Karakteristik Pribadi
              </span>
              <span className="font-mono font-black text-slate-800">{tkpScore} <span className="text-slate-400 font-normal">/ 225</span></span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${tkpScore >= PASSING_TKP ? 'bg-emerald-550 bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-rose-500'}`}
                style={{ width: `${tkpPercent}%` }}
              />
            </div>

            {/* Threshold marker */}
            <div className="relative mt-1 text-[10px] flex items-center justify-between text-slate-500 font-semibold">
              <span>Maks: 225</span>
              <span className="text-indigo-650 font-black absolute left-[73.7%] translate-x-[-50%] flex flex-col items-center">
                <span className="h-1 w-[2px] bg-indigo-500 mb-0.5" />
                Ambang Batas: 166
              </span>
              {tkpScore >= PASSING_TKP ? (
                <span className="text-emerald-600 font-black">Lolos</span>
              ) : (
                <span className="text-rose-600 font-black">Kurang {PASSING_TKP - tkpScore} poin</span>
              )}
            </div>
          </div>

          {/* TIU */}
          <div className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-4 shadow-xs">
            <div className="flex items-center justify-between font-bold text-xs text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-black flex items-center justify-center text-[9px]">TIU</span>
                Tes Inteligensia Umum
              </span>
              <span className="font-mono font-black text-slate-800">{tiuScore} <span className="text-slate-400 font-normal">/ 175</span></span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${tiuScore >= PASSING_TIU ? 'bg-emerald-550 bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-rose-500'}`}
                style={{ width: `${tiuPercent}%` }}
              />
            </div>

            {/* Threshold marker */}
            <div className="relative mt-1 text-[10px] flex items-center justify-between text-slate-500 font-semibold">
              <span>Maks: 175</span>
              <span className="text-indigo-650 font-black absolute left-[45.7%] translate-x-[-50%] flex flex-col items-center">
                <span className="h-1 w-[2px] bg-indigo-500 mb-0.5" />
                Ambang Batas: 80
              </span>
              {tiuScore >= PASSING_TIU ? (
                <span className="text-emerald-600 font-black">Lolos</span>
              ) : (
                <span className="text-rose-600 font-black">Kurang {PASSING_TIU - tiuScore} poin</span>
              )}
            </div>
          </div>

          {/* TWK */}
          <div className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-4 shadow-xs">
            <div className="flex items-center justify-between font-bold text-xs text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-black flex items-center justify-center text-[9px]">TWK</span>
                Tes Wawasan Kebangsaan
              </span>
              <span className="font-mono font-black text-slate-800">{twkScore} <span className="text-slate-400 font-normal">/ 150</span></span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${twkScore >= PASSING_TWK ? 'bg-emerald-550 bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-rose-500'}`}
                style={{ width: `${twkPercent}%` }}
              />
            </div>

            {/* Threshold marker */}
            <div className="relative mt-1 text-[10px] flex items-center justify-between text-slate-500 font-semibold">
              <span>Maks: 150</span>
              <span className="text-indigo-650 font-black absolute left-[43.3%] translate-x-[-50%] flex flex-col items-center">
                <span className="h-1 w-[2px] bg-indigo-500 mb-0.5" />
                Ambang Batas: 65
              </span>
              {twkScore >= PASSING_TWK ? (
                <span className="text-emerald-600 font-black">Lolos</span>
              ) : (
                <span className="text-rose-600 font-black">Kurang {PASSING_TWK - twkScore} poin</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
